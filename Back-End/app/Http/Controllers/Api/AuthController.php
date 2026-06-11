<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $admin = Admin::where('email', $request->email)->first();

        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الدخول غير صحيحة.'],
            ]);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح.',
            'token' => $token,
            'token_type' => 'Bearer',
            'admin' => new AdminResource($admin),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'admin' => new AdminResource($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح.',
        ]);
    }
}
