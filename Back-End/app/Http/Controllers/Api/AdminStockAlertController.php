<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockAlertResource;
use App\Models\StockAlert;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminStockAlertController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $alerts = StockAlert::query()
            ->latest()
            ->get();

        return StockAlertResource::collection($alerts);
    }
}