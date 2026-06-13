<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'product_name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'required', 'integer', 'min:0'],
        ];

        if ($this->hasFile('image')) {
            $rules['image'] = ['required', 'file', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:2048'];
        } elseif ($this->has('image')) {
            $rules['image'] = ['required', 'string', 'url', 'max:2048'];
        }

        return $rules;
    }
}
