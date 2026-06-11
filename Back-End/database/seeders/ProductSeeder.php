<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'product_name' => 'هاتف ذكي تجريبي',
                'description' => 'هاتف ذكي بمواصفات جيدة مناسب للاستخدام اليومي.',
                'price' => 1499.00,
                'quantity' => 12,
                'image_path' => 'products/demo-phone.jpg',
            ],
            [
                'product_name' => 'سماعة بلوتوث',
                'description' => 'سماعة لاسلكية بصوت واضح وعمر بطارية طويل.',
                'price' => 249.00,
                'quantity' => 8,
                'image_path' => 'products/demo-headphone.jpg',
            ],
            [
                'product_name' => 'ساعة ذكية',
                'description' => 'ساعة ذكية لمتابعة النشاط اليومي والإشعارات.',
                'price' => 399.00,
                'quantity' => 5,
                'image_path' => 'products/demo-watch.jpg',
            ],
            [
                'product_name' => 'لوحة مفاتيح لاسلكية',
                'description' => 'لوحة مفاتيح مريحة مناسبة للعمل المكتبي.',
                'price' => 179.00,
                'quantity' => 3,
                'image_path' => 'products/demo-keyboard.jpg',
            ],
            [
                'product_name' => 'ماوس لاسلكي',
                'description' => 'ماوس خفيف وسريع الاستجابة للاستخدام اليومي.',
                'price' => 89.00,
                'quantity' => 2,
                'image_path' => 'products/demo-mouse.jpg',
            ],
        ];

        foreach ($products as $productData) {
            Product::query()->updateOrCreate(
                ['product_name' => $productData['product_name']],
                [
                    'description' => $productData['description'],
                    'price' => $productData['price'],
                    'quantity' => $productData['quantity'],
                    'image_path' => $productData['image_path'],
                ]
            );
        }
    }
}