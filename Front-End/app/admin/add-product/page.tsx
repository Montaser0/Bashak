"use client";
import { useState } from "react";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    description: '',
    image: null as File | null,
    quantity: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // استرجاع التوكن من الـ Local Storage
    const token = localStorage.getItem('admin_token');

    // إعداد البيانات بتنسيق FormData (ضروري للملفات والـ API الخاص بك)
    const data = new FormData();
    data.append('product_name', formData.product_name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('quantity', formData.quantity);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/products', {
        method: 'POST',
        headers: {
          // الـ Authorization ضروري جداً لتجنب خطأ 401
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
          // لا تضعي Content-Type هنا
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert("تم إضافة المنتج بنجاح!");
        setFormData({ product_name: '', price: '', description: '', image: null, quantity: '' });
      } else {
        if (response.status === 401) {
            alert("غير مصرح بالوصول. يرجى التأكد من تسجيل الدخول.");
        } else {
            alert("خطأ: " + JSON.stringify(result.errors || result.message));
        }
      }
    } catch (error) {
      alert("تعذر الاتصال بالسيرفر! تأكدي أن لاراڤيل يعمل على المنفذ 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <h2 className="text-4xl font-bold mb-10">إضافة منتج جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input 
          className="w-full p-4 border rounded-2xl" 
          placeholder="اسم المنتج" 
          value={formData.product_name}
          onChange={(e) => setFormData({...formData, product_name: e.target.value})} 
          required
        />
        <input 
          className="w-full p-4 border rounded-2xl" 
          placeholder="السعر" 
          type="number" 
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})} 
          required
        />
        <input 
          className="w-full p-4 border rounded-2xl" 
          placeholder="الكمية" 
          type="number" 
          value={formData.quantity}
          onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
          required
        />
        <input 
          type="file" 
          className="w-full p-4 border rounded-2xl" 
          onChange={(e) => setFormData({...formData, image: e.target.files ? e.target.files[0] : null})} 
        />
        <textarea 
          className="w-full p-4 border rounded-2xl" 
          placeholder="الوصف" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-bold hover:bg-blue-700 transition"
        >
          {isLoading ? "جاري الإرسال..." : "إضافة المنتج"}
        </button>
      </form>
    </div>
  );
}
