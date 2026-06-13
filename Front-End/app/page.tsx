"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [products] = useState([
    { product_id: 1, name: 'ساعة ذكية برو', price: 199.99, image_url: 'https://images.unsplash.com/photo-1546868871-704132a5d082?auto=format&fit=crop&w=1200&q=80' },
    { product_id: 2, name: 'لابتوب', price: 1200.00, image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
    { product_id: 3, name: 'سماعات عازلة', price: 89.50, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
  ]);

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((res) => res.json())
      .then((data) => setDbProducts(Array.isArray(data) ? data : (data.data || [])))
      .catch((err) => console.error("Error:", err));

    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (p: any) => setCart([...cart, p]);
  const removeFromCart = (index: number) => setCart(cart.filter((_, i) => i !== index));

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  
  const sendToWhatsApp = () => {
    const text = `مرحباً، أريد طلب المنتجات التالية:%0A` + 
      cart.map((p, i) => `${i+1}- ${p.product_name || p.name} (${p.price} $)`).join('%0A') + 
      `%0A%0Aالمجموع الكلي: ${total.toFixed(2)} $`;
    window.open(`https://wa.me/201001112233?text=${text}`, '_blank');
  };

  const getImageUrl = (p: any) => {
    if (p.image_url) return p.image_url;
    if (p.image) {
       if (p.image.startsWith('http')) return p.image;
       const cleanPath = p.image.replace('public/', '');
       return `http://127.0.0.1:8000/storage/${cleanPath}`;
    }
    return 'https://via.placeholder.com/400';
  };

  return (
    <main className="bg-[#FAFAFA] text-[#333333] min-h-screen">
      {/* أيقونة السلة */}
      <button onClick={() => setShowCart(true)} className="fixed top-8 left-8 z-[100] bg-white p-4 rounded-full shadow-xl border-t-4 border-orange-500 hover:scale-110 transition-transform">
        <ShoppingCart className="text-blue-600" />
        {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-orange-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">{cart.length}</span>}
      </button>

      {/* مودال السلة */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[1000] flex justify-end">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="bg-white w-full max-w-md h-full p-8 shadow-2xl overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">سلة المشتريات</h2>
                <button onClick={() => setShowCart(false)}><X /></button>
              </div>
              {cart.length === 0 ? <p className="text-center text-gray-500">السلة فارغة</p> : (
                <div className="space-y-4">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border rounded-2xl">
                      <span>{item.product_name || item.name}</span>
                      <span className="font-bold">{item.price} $</span>
                      <button onClick={() => removeFromCart(i)} className="text-red-500"><Trash2 size={18}/></button>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4 text-xl font-bold flex justify-between">
                    <span>المجموع:</span>
                    <span>{total.toFixed(2)} $</span>
                  </div>
                  <button onClick={sendToWhatsApp} className="w-full bg-green-600 text-white py-4 rounded-full font-bold hover:bg-green-700 transition">إتمام الطلب عبر واتساب</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-white text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-black/70 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        <motion.div className="relative z-30 flex flex-col items-center">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter">TECH<span className="text-blue-500">&lt;</span>R<span className="text-orange-500">;</span>SE</h1>
          <p className="text-xl md:text-2xl mt-4 text-gray-300 font-light tracking-widest uppercase">// INNOVATION MEETS STYLE //</p>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-12 text-white/50"><ChevronDown size={40}/></motion.div>
        </motion.div>
        <div className="absolute -bottom-1 left-0 right-0 h-32 bg-[#FAFAFA] z-20" style={{ borderRadius: '100% 100% 0 0' }} />
      </section>

      {/* الرؤية */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80" className="rounded-[3rem] w-full h-[400px] object-cover shadow-2xl" />
          <div className="space-y-4 pt-16">
            <img src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=600&q=80" className="rounded-[3rem] h-[250px] object-cover shadow-xl" />
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80" className="rounded-[3rem] h-[250px] object-cover shadow-xl" />
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-5xl font-bold text-blue-900">الرؤية</h2>
          <p className="text-xl text-gray-600 leading-relaxed">صُممت منتجاتنا لتكون حلقة الوصل بين الحداثة والجمال.</p>
        </div>
      </section>

      {/* المنتجات الثابتة */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-20 text-blue-900">منتجات مميزة</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {products.map((p) => (
              <motion.div key={p.product_id} whileHover={{ y: -10 }} className="bg-[#FAFAFA] rounded-[3rem] p-4 shadow-lg">
                <img src={p.image_url} className="rounded-[2.5rem] w-full h-[400px] object-cover" />
                <h3 className="text-xl font-semibold mt-8">{p.name}</h3>
                <p className="text-orange-600 font-bold mb-4">{p.price} $</p>
                <button onClick={() => addToCart(p)} className="w-full bg-blue-600 text-white py-4 rounded-full font-bold">أضف للسلة</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* منتجات الأدمن */}
      {dbProducts.length > 0 && (
        <section className="py-24 bg-[#F0F4F8]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-20 text-blue-900">أحدث الإضافات</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {dbProducts.map((p) => (
                <motion.div key={p.id} whileHover={{ y: -10 }} className="bg-white p-6 rounded-[3rem] shadow-lg">
                  <img 
                    src={getImageUrl(p)} 
                    alt={p.product_name}
                    className="rounded-[2.5rem] w-full h-[300px] object-cover mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400';
                    }}
                  />
                  <h3 className="text-xl font-semibold">{p.product_name}</h3>
                  <p className="text-orange-600 font-bold mb-4">{p.price} $</p>
                  <button onClick={() => addToCart(p)} className="w-full bg-blue-600 text-white py-4 rounded-full font-bold">أضف للسلة</button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
