<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'image' => ['required'],
        ];
    }

    protected function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->hasFile('image')) {
                return;
            }

            $image = $this->input('image');

            if (! is_string($image) || ! filter_var($image, FILTER_VALIDATE_URL)) {
                $validator->errors()->add('image', 'حقل الصورة يجب أن يكون ملفًا أو رابطًا صحيحًا.');
                return;
            }

            if (Str::length($image) > 2048) {
                $validator->errors()->add('image', 'رابط الصورة طويل جدًا.');
            }
        });
    }
}
