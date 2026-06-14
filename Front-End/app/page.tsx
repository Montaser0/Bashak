"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Trash2, ChevronDown, Check, Minus, Plus, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const getProductId = (p: any) => p.id ?? p.product_id;
const getProductName = (p: any) => p.product_name || p.name;
const getItemQty = (p: any) => p.quantity || 1;

export default function Home() {
  const [products] = useState([
    { product_id: 1, name: 'ساعة ذكية برو', price: 199.99, image_url: 'https://images.unsplash.com/photo-1546868871-704132a5d082?auto=format&fit=crop&w=1200&q=80' },
    { product_id: 2, name: 'لابتوب', price: 1200.00, image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
    { product_id: 3, name: 'سماعات عازلة', price: 89.50, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
  ]);

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((res) => res.json())
      .then((data) => setDbProducts(Array.isArray(data) ? data : (data.data || [])))
      .catch((err) => console.error("Error:", err));

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      setCart(parsed.map((item: any) => ({ ...item, quantity: item.quantity || 1 })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (p: any) => {
    const id = getProductId(p);
    const existing = cart.find((item) => getProductId(item) === id);
    if (existing) {
      setCart(
        cart.map((item) =>
          getProductId(item) === id
            ? { ...item, quantity: getItemQty(item) + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...p, quantity: 1 }]);
    }
    setNotification(`تمت إضافة ${getProductName(p)} إلى السلة!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQuantity = (id: number | string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (getProductId(item) !== id) return item;
          const newQty = getItemQty(item) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        })
        .filter((item) => getItemQty(item) > 0)
    );
  };

  const removeFromCart = (id: number | string) => {
    setCart(cart.filter((item) => getProductId(item) !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + getItemQty(item), 0);
  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price || 0) * getItemQty(item),
    0
  );

  const sendToWhatsApp = () => {
    const text =
      `مرحباً، أريد طلب المنتجات التالية:%0A` +
      cart
        .map(
          (p, i) =>
            `${i + 1}- ${getProductName(p)} × ${getItemQty(p)} (${parseFloat(p.price).toFixed(2)} $)`
        )
        .join("%0A") +
      `%0A%0Aالمجموع الكلي: ${total.toFixed(2)} $`;
    window.open(`https://wa.me/905316924944?text=${text}`, "_blank");
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
      <button
        onClick={() => setShowCart(true)}
        className="fixed top-8 left-8 z-[100] bg-white p-4 rounded-full shadow-xl border border-gray-100 hover:scale-110 hover:shadow-2xl transition-all"
      >
        <ShoppingCart className="text-[#3b66f5]" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#ff6b35] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">
            {cartCount}
          </span>
        )}
      </button>

      {/* إشعار إضافة المنتج (Toast) */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] bg-blue-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
          >
            <Check size={20} className="text-orange-400"/> {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* سلة المشتريات */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[1000]"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-[1001] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900">
                  عناصر السلة : <span className="text-[#3b66f5]">{cartCount}</span>
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-800"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <ShoppingCart size={48} className="text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">السلة فارغة</p>
                    <p className="text-gray-300 text-sm mt-1">أضف منتجات لتبدأ التسوق</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {cart.map((item) => {
                      const id = getProductId(item);
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-4 py-5 border-b border-gray-100 last:border-0"
                        >
                          <img
                            src={getImageUrl(item)}
                            alt={getProductName(item)}
                            className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/80";
                            }}
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm leading-snug truncate">
                              {getProductName(item)}
                            </h3>
                            <p className="text-[#ff6b35] font-black text-base mt-1">
                              {parseFloat(item.price).toFixed(2)} $
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(id, -1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-[#3b66f5] hover:text-[#3b66f5] transition"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center font-bold text-gray-800 text-sm">
                                {getItemQty(item)}
                              </span>
                              <button
                                onClick={() => updateQuantity(id, 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-[#3b66f5] hover:text-[#3b66f5] transition"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFromCart(id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="px-6 py-5 border-t border-gray-100 bg-white">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-black text-gray-800 text-lg">المجموع الفرعي</span>
                    <span className="font-black text-[#ff6b35] text-xl">
                      {total.toFixed(2)} $
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={sendToWhatsApp}
                      className="flex-1 bg-[#ff6b35] hover:bg-[#e55a28] text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-100"
                    >
                      <MessageCircle size={18} />
                      واتس أب
                    </button>
                    <button
                      onClick={() => setShowCart(false)}
                      className="flex-1 border-2 border-[#ff6b35] text-[#ff6b35] hover:bg-orange-50 py-3.5 rounded-xl font-bold transition-all"
                    >
                      تسوق أكثر
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
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
                <button 
                  onClick={() => addToCart(p)} 
                  className="w-full bg-blue-600 hover:bg-orange-600 text-white py-4 rounded-full font-bold transition-colors"
                >
                  أضف للسلة
                </button>
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
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400'; }}
                  />
                  <h3 className="text-xl font-semibold">{p.product_name}</h3>
                  <p className="text-orange-600 font-bold mb-4">{p.price} $</p>
                  <button 
                    onClick={() => addToCart(p)} 
                    className="w-full bg-blue-600 hover:bg-orange-600 text-white py-4 rounded-full font-bold transition-colors"
                  >
                    أضف للسلة
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
