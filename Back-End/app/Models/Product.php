<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'product_name',
        'description',
        'price',
        'image_path',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function getImageUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->image_path);
    }
}
