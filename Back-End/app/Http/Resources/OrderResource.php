<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer_name' => $this->customer_name,
            'whatsapp_number' => $this->whatsapp_number,
            'notes' => $this->notes,
            'status' => $this->status,
            'subtotal' => $this->subtotal,
            'total' => $this->total,
            'whatsapp_recipient_number' => $this->whenLoaded('items') ? $this->whatsappRecipientNumber() : null,
            'items' => $this->whenLoaded('items', function () {
                return OrderItemResource::collection($this->items);
            }),
            'whatsapp_message' => $this->whenLoaded('items') ? $this->whatsappMessage() : null,
            'whatsapp_url' => $this->whenLoaded('items') ? $this->whatsappUrl() : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}