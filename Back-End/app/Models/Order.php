<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'customer_name',
        'whatsapp_number',
        'notes',
        'subtotal',
        'total',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'total' => 'decimal:2',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function whatsappMessage(): string
    {
        $lines = [
            'فاتورة الطلب: ' . $this->order_number,
            'العميل: ' . $this->customer_name,
            'رقم الواتس أب: ' . $this->whatsapp_number,
            'حالة الطلب: ' . $this->status,
            '',
            'تفاصيل المنتجات:',
        ];

        foreach ($this->items as $item) {
            $lines[] = sprintf(
                '- %s × %d = %s',
                $item->product_name,
                $item->quantity,
                $this->formatMoney((float) $item->line_total)
            );
        }

        $lines[] = '';
        $lines[] = 'الإجمالي الفرعي: ' . $this->formatMoney((float) $this->subtotal);
        $lines[] = 'الإجمالي النهائي: ' . $this->formatMoney((float) $this->total);

        if ($this->notes) {
            $lines[] = '';
            $lines[] = 'ملاحظات: ' . $this->notes;
        }

        return implode("\n", $lines);
    }

    public function whatsappUrl(): string
    {
        $phoneNumber = preg_replace('/\D+/', '', $this->whatsapp_number) ?? '';

        return 'https://wa.me/' . $phoneNumber . '?text=' . rawurlencode($this->whatsappMessage());
    }

    private function formatMoney(float $amount): string
    {
        return number_format($amount, 2, '.', '');
    }
}