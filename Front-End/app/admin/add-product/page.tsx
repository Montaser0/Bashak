"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2, Package } from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/admin/products";

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    description: "",
    quantity: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (!image) {
      setError("يجب رفع صورة للمنتج");
      return;
    }

    setIsLoading(true);
    const data = new FormData();
    data.append("product_name", formData.product_name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("quantity", formData.quantity);
    data.append("image", image);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert("تمت الإضافة بنجاح!");
        router.push("/admin/dashboard");
      } else if (response.status === 401) {
        router.push("/admin/login");
      } else {
        const msg =
          result.message ||
          Object.values(result.errors || {})
            .flat()
            .join("\n") ||
          "حدث خطأ أثناء إضافة المنتج";
        setError(msg);
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تأكد أن السيرفر يعمل على http://127.0.0.1:8000");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-gray-500 mb-8 hover:text-[#3b66f5] transition w-fit"
        >
          <ArrowLeft size={20} /> العودة للوحة التحكم
        </Link>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-blue-50 text-[#3b66f5] rounded-3xl">
              <Package size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">إضافة منتج جديد</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-[#3b66f5] rounded-2xl outline-none transition"
                placeholder="اسم المنتج *"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                required
              />
              <input
                className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-[#3b66f5] rounded-2xl outline-none transition"
                placeholder="السعر ($) *"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <input
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-[#3b66f5] rounded-2xl outline-none transition"
              placeholder="الكمية المتوفرة *"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />

            <label className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-[#3b66f5] transition cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="معاينة"
                  className="w-32 h-32 object-cover rounded-2xl mb-3 border border-gray-100"
                />
              ) : (
                <Upload size={32} className="mb-2" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageChange}
                required
              />
              <span className="font-bold text-center">
                {image ? image.name : "اضغط لرفع صورة المنتج *"}
              </span>
              <span className="text-xs mt-1 text-gray-300">JPG, PNG, GIF, WEBP — حتى 2MB</span>
            </label>

            <textarea
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-[#3b66f5] rounded-2xl outline-none transition h-32"
              placeholder="وصف تفصيلي للمنتج *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#3b66f5] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#ff6b35] transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> جاري الإرسال...
                </>
              ) : (
                "حفظ المنتج الجديد"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
