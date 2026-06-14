"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, UserPlus, ShieldUser, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<any[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminForm, setAdminForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const fetchAdmins = () => {
    const token = localStorage.getItem("admin_token");
    setAdminsLoading(true);

    fetch("http://127.0.0.1:8000/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setAdmins(data.data || data))
      .catch((err) => console.error(err))
      .finally(() => setAdminsLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(adminForm),
      });

      const data = await response.json();

      if (response.ok) {
        fetchAdmins();
        setShowAdminModal(false);
        setAdminForm({ full_name: "", email: "", password: "", password_confirmation: "" });
        alert("تم إنشاء حساب الأدمن بنجاح!");
      } else {
        const errorMessage =
          data.message ||
          Object.values(data.errors || {}).flat().join("\n") ||
          "حدث خطأ أثناء إنشاء الحساب";
        alert(errorMessage);
      }
    } catch {
      alert("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setAdminLoading(false);
    }
  };

  const deleteAdmin = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الأدمن؟")) return;

    const response = await fetch(`http://127.0.0.1:8000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      fetchAdmins();
      alert("تم حذف الأدمن بنجاح!");
    } else {
      alert(data.message || "حدث خطأ أثناء الحذف");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-gray-500 mb-8 hover:text-[#3b66f5] transition"
        >
          <ArrowLeft size={20} /> العودة للوحة التحكم
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-[#3b66f5] rounded-3xl">
              <ShieldUser size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">مديرو النظام</h1>
              <p className="text-gray-500 mt-1">إدارة حسابات الأدمن والصلاحيات</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdminModal(true)}
            className="bg-[#1a1a1a] hover:bg-[#3b66f5] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <UserPlus size={18} /> إضافة أدمن جديد
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          {adminsLoading ? (
            <div className="p-20 text-center">
              <Loader2 className="animate-spin inline text-[#3b66f5]" size={40} />
            </div>
          ) : admins.length === 0 ? (
            <div className="p-16 text-center text-gray-400">لا يوجد مديرون مسجلون</div>
          ) : (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-sm">
                  <th className="p-6">#</th>
                  <th className="p-6">الاسم</th>
                  <th className="p-6">البريد الإلكتروني</th>
                  <th className="p-6">تاريخ الإنشاء</th>
                  <th className="p-6 text-center">العمليات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((admin, index) => (
                  <tr key={admin.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-6 text-gray-400 font-bold">{index + 1}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3b66f5] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                          {(admin.full_name || admin.name || "A").charAt(0)}
                        </div>
                        <span className="font-bold text-gray-800">{admin.full_name || admin.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-gray-600">{admin.email}</td>
                    <td className="p-6 text-gray-500">{formatDate(admin.created_at)}</td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => deleteAdmin(admin.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="حذف الأدمن"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">إضافة أدمن جديد</h2>
                <button onClick={() => setShowAdminModal(false)}>
                  <X />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <input
                  className="w-full border border-gray-200 p-4 rounded-xl focus:border-[#3b66f5] outline-none"
                  placeholder="الاسم الكامل"
                  value={adminForm.full_name}
                  onChange={(e) => setAdminForm({ ...adminForm, full_name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  className="w-full border border-gray-200 p-4 rounded-xl focus:border-[#3b66f5] outline-none"
                  placeholder="البريد الإلكتروني"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  required
                />
                <input
                  type="password"
                  className="w-full border border-gray-200 p-4 rounded-xl focus:border-[#3b66f5] outline-none"
                  placeholder="كلمة المرور (8 أحرف على الأقل)"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  minLength={8}
                  required
                />
                <input
                  type="password"
                  className="w-full border border-gray-200 p-4 rounded-xl focus:border-[#3b66f5] outline-none"
                  placeholder="تأكيد كلمة المرور"
                  value={adminForm.password_confirmation}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password_confirmation: e.target.value })
                  }
                  minLength={8}
                  required
                />
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold hover:bg-[#3b66f5] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {adminLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} /> إنشاء الحساب
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
