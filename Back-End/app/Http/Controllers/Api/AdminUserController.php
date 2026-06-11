<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\Admin\UpdateAdminPasswordRequest;
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
            'message' => 'تم إضافة المستخدم بنجاح.',
            'admin' => new AdminResource($admin),
        ], 201);
    }

    public function updatePassword(UpdateAdminPasswordRequest $request, Admin $admin): JsonResponse
    {
        $admin->update([
            'password' => $request->password,
        ]);

        $admin->tokens()->delete();

        return response()->json([
            'message' => 'تم تحديث كلمة المرور بنجاح.',
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

        if ($admin->products()->exists()) {
            return response()->json([
                'message' => 'لا يمكن حذف مدير لديه منتجات مرتبطة. انقل المنتجات أو احذفها أولاً.',
            ], 422);
        }

        $admin->tokens()->delete();
        $admin->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم بنجاح.',
        ]);
    }
}
