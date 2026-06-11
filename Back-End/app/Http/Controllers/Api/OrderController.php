<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $requestedItems = collect($validated['items']);
        $products = Product::query()
            ->whereIn('id', $requestedItems->pluck('product_id')->all())
            ->get()
            ->keyBy('id');

        $order = DB::transaction(function () use ($validated, $requestedItems, $products) {
            $subtotal = 0;
            $preparedItems = [];

            foreach ($requestedItems as $item) {
                $product = $products->get($item['product_id']);

                if (! $product) {
                    throw ValidationException::withMessages([
                        'items' => ['أحد المنتجات المحددة لم يعد متاحاً.'],
                    ]);
                }

                $quantity = (int) $item['quantity'];
                $unitPrice = (float) $product->price;
                $lineTotal = round($unitPrice * $quantity, 2);
                $subtotal += $lineTotal;

                $preparedItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->product_name,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ];
            }

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'customer_name' => $validated['customer_name'],
                'whatsapp_number' => $validated['whatsapp_number'],
                'notes' => $validated['notes'] ?? null,
                'subtotal' => round($subtotal, 2),
                'total' => round($subtotal, 2),
                'status' => 'pending',
                'created_by' => null,
            ]);

            $order->items()->createMany($preparedItems);

            return $order->load('items');
        });

        return response()->json([
            'message' => 'تم إنشاء الطلب بنجاح.',
            'order' => new OrderResource($order),
            'whatsapp_url' => $order->whatsappUrl(),
            'whatsapp_message' => $order->whatsappMessage(),
        ], 201);
    }

    private function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'ORD-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(4));
        } while (Order::query()->where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}