"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // إرسال البيانات للـ API للتحقق منها
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/admin/add-product'); // الانتقال لصفحة الإضافة عند نجاح الدخول
    } else {
      alert("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-black text-center">دخول الأدمن</h2>
        <input 
          type="email" placeholder="البريد الإلكتروني" required
          className="w-full p-4 border rounded-2xl"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="كلمة المرور" required
          className="w-full p-4 border rounded-2xl"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-gray-900 text-white py-4 rounded-full font-bold hover:bg-black transition">
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}