<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\Admin\UpdateAdminRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminUserController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $admins = Admin::query()
            ->latest()
            ->get();

        return AdminResource::collection($admins);
    }

    public function store(StoreAdminRequest $request): JsonResponse
    {
        $admin = Admin::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        return response()->json([
            'message' => 'لقد تم انشاء الحساب بنجاح.',
            'admin' => new AdminResource($admin),
        ], 201);
    }

    public function update(UpdateAdminRequest $request, Admin $admin): JsonResponse
    {
        $data = [];

        if ($request->filled('full_name')) {
            $data['full_name'] = $request->full_name;
        }

        if ($request->filled('email')) {
            $data['email'] = $request->email;
        }

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $admin->update($data);

        if ($request->filled('password')) {
            $admin->tokens()->delete();
        }

        return response()->json([
            'message' => 'تم تحديث بيانات المستخدم بنجاح.',
            'admin' => new AdminResource($admin->fresh()),
        ]);
    }

    public function destroy(Request $request, Admin $admin): JsonResponse
    {
        if ($request->user()->id === $admin->id) {
            return response()->json([
                'message' => 'لا يمكنك حذف حسابك الحالي.',
            ], 422);
        }

        if (Admin::count() <= 1) {
            return response()->json([
                'message' => 'لا يمكن حذف آخر مدير في النظام.',
            ], 422);
        }

        $admin->tokens()->delete();
        $admin->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم بنجاح.',
        ]);
    }
}
