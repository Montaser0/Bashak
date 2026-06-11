<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminOrderController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->with('items')
            ->latest()
            ->get();

        return OrderResource::collection($orders);
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order->load('items'));
    }
}