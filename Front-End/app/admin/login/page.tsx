"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      console.log("استجابة السيرفر:", data);

      if (res.ok) {
        const token = data.access_token || data.token;
        
        if (token) {
            localStorage.setItem('admin_token', token);
            alert("تم تسجيل الدخول بنجاح!");
            router.push('/admin/add-product');
        } else {
            alert("حدث خطأ: لم يتم العثور على التوكن في استجابة السيرفر.");
        }
      } else {
        alert("بيانات الدخول غير صحيحة: " + (data.message || "خطأ غير معروف"));
      }
    } catch (error) {
      alert("تعذر الاتصال بالخادم، تأكدي أنه يعمل.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-6">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-black text-center">دخول الأدمن</h2>
        <input 
          type="email" placeholder="البريد الإلكتروني" required
          className="w-full p-4 border rounded-2xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="كلمة المرور" required
          className="w-full p-4 border rounded-2xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-full font-bold hover:bg-black transition">
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}
