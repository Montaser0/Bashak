<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $products = Product::query()
            ->latest()
            ->get();

        return ProductResource::collection($products);
    }

    public function show(Product $product): ProductResource
    {
        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('products', 'public')
            : $request->input('image');

        $product = Product::create([
            'product_name' => $request->product_name,
            'description' => $request->description,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'image_path' => $imagePath,
        ]);

        return response()->json([
            'message' => 'تم إضافة المنتج بنجاح.',
            'product' => new ProductResource($product),
        ], 201);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $data = $request->only(['product_name', 'description', 'price', 'quantity']);

        if ($request->hasFile('image')) {
            $this->deleteLocalImageIfNeeded($product->image_path);
            $data['image_path'] = $request->file('image')->store('products', 'public');
        } elseif ($request->filled('image')) {
            $this->deleteLocalImageIfNeeded($product->image_path);
            $data['image_path'] = $request->input('image');
        }

        $product->update($data);

        return response()->json([
            'message' => 'تم تحديث المنتج بنجاح.',
            'product' => new ProductResource($product->fresh()),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->deleteLocalImageIfNeeded($product->image_path);
        $product->delete();

        return response()->json([
            'message' => 'تم حذف المنتج بنجاح.',
        ]);
    }

    private function deleteLocalImageIfNeeded(?string $imagePath): void
    {
        if (! $imagePath) {
            return;
        }

        if (Str::startsWith($imagePath, ['http://', 'https://'])) {
            return;
        }

        Storage::disk('public')->delete($imagePath);
    }
}
