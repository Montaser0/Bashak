"use client";
import { useState } from "react";

export default function AddProduct() {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image_url: '', category: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    //  fetch('/api/products', { method: 'POST', body: JSON.stringify(formData) })
    alert("تم إرسال البيانات (قم بربطها بالـ API لترسلها للـ Database)");
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <h2 className="text-4xl font-bold mb-10">إضافة منتج جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input className="w-full p-4 border rounded-2xl" placeholder="اسم المنتج" onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input className="w-full p-4 border rounded-2xl" placeholder="السعر" type="number" onChange={(e) => setFormData({...formData, price: e.target.value})} />
        <input className="w-full p-4 border rounded-2xl" placeholder="رابط الصورة" onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
        <textarea className="w-full p-4 border rounded-2xl" placeholder="الوصف" onChange={(e) => setFormData({...formData, description: e.target.value})} />
        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-full font-bold">إضافة المنتج</button>
      </form>
    </div>
  );
}