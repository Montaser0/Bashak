"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Plus, UserPlus, ShieldUser, Package, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [admins] = useState([
    { id: 1, name: "Admin ", email: "admin@tech-raise.com" },
  ]);

  const getImageUrl = (p: any) => {
    if (p.image_url) return p.image_url;
    if (p.image) {
      if (p.image.startsWith('http')) return p.image;
      const cleanPath = p.image.replace('public/', '');
      return `http://127.0.0.1:8000/storage/${cleanPath}`;
    }
    return 'https://via.placeholder.com/400';
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const deleteProduct = async (id: number) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await fetch(`http://127.0.0.1:8000/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
    });
    setProducts(products.filter(p => p.id !== id));
  };

  const handleUpdate = async () => {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/products/${editingProduct.id}`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ ...editingProduct, _method: 'PUT' })
    });

    if (response.ok) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setShowModal(false);
      alert("تم التحديث بنجاح!");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#FAFAFA] min-h-screen">
      <div className="flex justify-between items-end mb-10">
        <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter">
            لوحة تحكم <span className="text-[#3b66f5]">Tech</span><span className="text-[#ff6b35]">Rise</span>
        </h1>
        <button onClick={() => router.push('/admin/add-product')} className="bg-[#3b66f5] hover:bg-[#ff6b35] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2">
          <Plus size={20} /> إضافة منتج جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><Package size={20} /> إدارة المخزون</h2>
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-20 text-center"><Loader2 className="animate-spin inline text-[#3b66f5]" size={40} /></div>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-sm">
                    <th className="p-6">الصورة</th>
                    <th className="p-6">المنتج</th>
                    <th className="p-6">السعر</th>
                    <th className="p-6">الكمية</th>
                    <th className="p-6 text-center">العمليات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4">
                        <img src={getImageUrl(p)} alt={p.product_name} className="w-14 h-14 rounded-2xl object-cover border border-gray-100" />
                      </td>
                      <td className="p-6 font-bold text-gray-800">{p.product_name}</td>
                      <td className="p-6 text-[#ff6b35] font-black">{p.price} $</td>
                      <td className="p-6 text-gray-600 font-bold">{p.quantity || '0'}</td>
                      <td className="p-6 flex justify-center gap-3">
                        <button onClick={() => { setEditingProduct(p); setShowModal(true); }} className="p-2 text-[#3b66f5] hover:bg-blue-100 rounded-lg transition-all"><Edit size={18} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-700">مديرو النظام</h2>
            <ShieldUser className="text-[#3b66f5]" />
          </div>
          <div className="space-y-4">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-[#3b66f5] text-white rounded-full flex items-center justify-center font-bold">
                    {admin.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{admin.name}</p>
                  <p className="text-xs text-gray-400">{admin.email}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 bg-[#1a1a1a] text-white rounded-2xl font-bold hover:bg-[#3b66f5] transition-all flex items-center justify-center gap-2">
            <UserPlus size={18} /> إضافة أدمن جديد
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">تعديل المنتج</h2>
                <button onClick={() => setShowModal(false)}><X /></button>
              </div>
              <input className="w-full border border-gray-200 p-4 rounded-xl mb-4 focus:border-[#3b66f5] outline-none" value={editingProduct?.product_name || ''} onChange={e => setEditingProduct({...editingProduct, product_name: e.target.value})} placeholder="اسم المنتج" />
              <input className="w-full border border-gray-200 p-4 rounded-xl mb-4 focus:border-[#3b66f5] outline-none" value={editingProduct?.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="السعر" />
              <button onClick={handleUpdate} className="w-full bg-[#3b66f5] text-white py-4 rounded-xl font-bold hover:bg-[#ff6b35] transition-all">حفظ التغييرات</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}