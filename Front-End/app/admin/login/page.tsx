"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
      
      if (res.ok) {
        const token = data.access_token || data.token;
        if (token) {
            localStorage.setItem('admin_token', token);
            router.push('/admin/dashboard');
        } else {
            alert("خطأ في بيانات التوثيق");
        }
      } else {
        alert("بيانات الدخول غير صحيحة");
      }
    } catch (error) {
      alert("تعذر الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5fbff] px-6">
      <div className="bg-[#f5fbff] p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md border border-[#333]">
        <h2 className="text-3xl font-black text-center text-white mb-2">
          دخول <span className="text-[#3b66f5]">Tech</span><span className="text-[#ff6b35]">Rise</span>
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative group">
            <Mail className="absolute right-4 top-4 text-gray-600 group-focus-within:text-[#3b66f5] transition-colors" size={20} />
            <input 
              type="email" placeholder="البريد الإلكتروني" required
              className="w-full p-4 pr-12 bg-[#ffe8e8] text-white border border-[#333] rounded-2xl outline-none focus:border-[#3b66f5] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute right-4 top-4 text-gray-600 group-focus-within:text-[#3b66f5] transition-colors" size={20} />
            <input 
              type="password" placeholder="كلمة المرور" required
              className="w-full p-4 pr-12 bg-[#252525] text-white border border-[#333] rounded-2xl outline-none focus:border-[#3b66f5] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#3b66f5] text-white py-4 rounded-2xl font-bold hover:bg-[#ff6b35] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(59,102,245,0.2)]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
