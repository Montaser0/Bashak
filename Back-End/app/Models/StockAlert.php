<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockAlert extends Model
{
    protected $fillable = [
        'product_id',
        'product_name',
        'remaining_quantity',
        'threshold',
        'message',
        'is_resolved',
    ];

    protected function casts(): array
    {
        return [
            'remaining_quantity' => 'integer',
            'threshold' => 'integer',
            'is_resolved' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}