"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Edit, Plus, ShieldUser, Package, Upload, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setEditImage(null);
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setEditImage(null);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    const token = localStorage.getItem('admin_token');
    const data = new FormData();
    data.append('product_name', editingProduct.product_name);
    data.append('price', String(editingProduct.price));
    data.append('quantity', String(parseInt(editingProduct.quantity, 10) || 0));
    if (editImage) data.append('image', editImage);
    data.append('_method', 'PUT');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/products/${editingProduct.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: data,
      });

      if (response.ok) {
        const resData = await response.json();
        const updated = resData.product || editingProduct;
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        closeEditModal();
        alert("تم التحديث بنجاح!");
      } else {
        alert("حدث خطأ أثناء التحديث");
      }
    } catch {
      alert("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#FAFAFA] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
        <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter">
            لوحة تحكم <span className="text-[#3b66f5]">Tech</span><span className="text-[#ff6b35]">Rise</span>
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push('/admin/admins')}
            className="bg-[#1a1a1a] hover:bg-[#3b66f5] text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <ShieldUser size={20} /> إدارة الأدمنز
          </button>
          <Link
            href="/admin/add-product"
            className="bg-[#3b66f5] hover:bg-[#ff6b35] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={20} /> إضافة منتج جديد
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <Package size={20} /> إدارة المخزون
        </h2>
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
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openEditModal(p)} className="p-2 text-[#3b66f5] hover:bg-blue-100 rounded-lg transition-all"><Edit size={18} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">تعديل المنتج</h2>
                <button onClick={closeEditModal}><X /></button>
              </div>

              <div className="mb-4 flex flex-col items-center">
                <img
                  src={editImage ? URL.createObjectURL(editImage) : getImageUrl(editingProduct)}
                  alt={editingProduct?.product_name}
                  className="w-24 h-24 rounded-2xl object-cover border border-gray-100 mb-3"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 w-full flex flex-col items-center justify-center text-gray-400 hover:border-[#3b66f5] transition cursor-pointer">
                  <Upload size={24} className="mb-1" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="editImageInput"
                    onChange={(e) => setEditImage(e.target.files ? e.target.files[0] : null)}
                  />
                  <label htmlFor="editImageInput" className="cursor-pointer font-bold text-sm text-center">
                    {editImage ? editImage.name : "اضغط لتغيير صورة المنتج"}
                  </label>
                </div>
              </div>

              <input className="w-full border border-gray-200 p-4 rounded-xl mb-4 focus:border-[#3b66f5] outline-none" value={editingProduct?.product_name || ''} onChange={e => setEditingProduct({...editingProduct, product_name: e.target.value})} placeholder="اسم المنتج" />
              <input className="w-full border border-gray-200 p-4 rounded-xl mb-4 focus:border-[#3b66f5] outline-none" type="number" min="0" value={editingProduct?.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="السعر" />
              <input className="w-full border border-gray-200 p-4 rounded-xl mb-4 focus:border-[#3b66f5] outline-none" type="number" min="0" value={editingProduct?.quantity ?? ''} onChange={e => setEditingProduct({...editingProduct, quantity: e.target.value})} placeholder="الكمية المتوفرة" />
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full bg-[#3b66f5] text-white py-4 rounded-xl font-bold hover:bg-[#ff6b35] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isUpdating ? <><Loader2 className="animate-spin" size={18} /> جاري الحفظ...</> : "حفظ التغييرات"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
