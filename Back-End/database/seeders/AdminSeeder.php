<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::query()->updateOrCreate(
            ['email' => 'admin@store.com'],
            [
                'full_name' => 'مدير المتجر',
                'password' => 'password123',
            ]
        );
    }
}
