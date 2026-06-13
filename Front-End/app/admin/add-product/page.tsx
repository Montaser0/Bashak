"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, Package } from "lucide-react";

export default function AddProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    product_name: '', price: '', description: '', image: null as File | null, quantity: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    const data = new FormData();
    data.append('product_name', formData.product_name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('quantity', formData.quantity);
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        body: data,
      });

      if (response.ok) {
        alert("تمت الإضافة بنجاح!");
        router.push('/admin/dashboard'); // العودة للوحة التحكم بعد الإضافة
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 mb-8 hover:text-blue-600 transition">
          <ArrowLeft size={20} /> العودة للوحة التحكم
        </button>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl"><Package size={32} /></div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">إضافة منتج جديد</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input className="w-full p-5 bg-gray-50 border-transparent border-2 focus:border-blue-500 rounded-2xl outline-none transition" placeholder="اسم المنتج" value={formData.product_name} onChange={(e) => setFormData({...formData, product_name: e.target.value})} required />
              <input className="w-full p-5 bg-gray-50 border-transparent border-2 focus:border-blue-500 rounded-2xl outline-none transition" placeholder="السعر ($)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
            </div>

            <input className="w-full p-5 bg-gray-50 border-transparent border-2 focus:border-blue-500 rounded-2xl outline-none transition" placeholder="الكمية المتوفرة" type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
            
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 transition cursor-pointer">
              <Upload size={32} className="mb-2" />
              <input type="file" className="hidden" id="fileInput" onChange={(e) => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})} />
              <label htmlFor="fileInput" className="cursor-pointer font-bold">{formData.image ? formData.image.name : "اضغط لرفع صورة المنتج"}</label>
            </div>

            <textarea className="w-full p-5 bg-gray-50 border-transparent border-2 focus:border-blue-500 rounded-2xl outline-none transition h-32" placeholder="وصف تفصيلي للمنتج..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center gap-2">
              {isLoading ? <><Loader2 className="animate-spin" /> جاري الإرسال...</> : "حفظ المنتج الجديد"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
