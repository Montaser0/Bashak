"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShoppingCart, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [products] = useState([
    { product_id: 1, name: 'ساعة ذكية برو', price: 199.99, image_url: 'https://images.unsplash.com/photo-1546868871-704132a5d082?auto=format&fit=crop&w=1200&q=80' },
    { product_id: 2, name: 'لابتوب ', price: 1200.00, image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80' },
    { product_id: 3, name: 'سماعات عازلة', price: 89.50, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80' },
  ]);

  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any) => setCart([...cart, product]);
  const removeFromCart = (index: number) => setCart(cart.filter((_, i) => i !== index));

  return (
    <main className="bg-[#FAFAFA] text-[#333333] min-h-screen">
      
      {/* أيقونة السلة */}
      <button onClick={() => setShowCart(true)} className="fixed top-8 right-8 z-50 bg-white p-4 rounded-full shadow-xl">
        <ShoppingCart />
        {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-blue-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center">{cart.length}</span>}
      </button>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-gray-900" />
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />        <h1 className="relative z-10 text-8xl md:text-9xl font-black tracking-tighter">TECH-RAISE</h1>
        <p className="relative z-10 text-2xl mt-4 text-gray-300 font-light tracking-widest uppercase">The Art of Modern Tech</p>
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-16 z-20">
          <ChevronDown size={60} className="text-blue-500" />
        </motion.div>
        <div className="absolute -bottom-1 w-full h-32 bg-[#FAFAFA]" style={{ borderRadius: '100% 100% 0 0', transform: 'scaleX(1.3)' }} />
      </section>

      {/* Craftsmanship Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80" className="rounded-[2.5rem] w-full h-[400px] object-cover" />
          <div className="space-y-4 pt-16">
            <img src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=600&q=80" className="rounded-[2.5rem] h-[250px] object-cover" />
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80" className="rounded-[2.5rem] h-[250px] object-cover" />
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-6xl font-medium tracking-tight">Exceptional Craftsmanship</h2>
          <p className="text-xl text-gray-600 leading-relaxed">تصميم يلتقي بالوظيفة. في Tech-Raise، نحن نعيد صياغة مفهوم التكنولوجيا لتكون قطعة فنية في مساحتك الخاصة.</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-medium mb-20">Our Collection</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {products.map((product) => (
              <div key={product.product_id} className="group cursor-pointer">
                <div className="bg-white rounded-[3rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500">
                  <img src={product.image_url} className="rounded-[2.5rem] w-full h-[400px] object-cover" />
                </div>
                <h3 className="text-xl font-medium mt-8">{product.name}</h3>
                <p className="text-gray-500 font-bold mb-4">{product.price} $</p>
                <button onClick={() => addToCart(product)} className="w-full bg-gray-900 text-white py-4 rounded-full hover:bg-blue-600 transition">إضافة للسلة</button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[100] p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">سلتك</h2>
              <button onClick={() => setShowCart(false)}><X /></button>
            </div>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-6 border-b pb-4">
                <p>{item.name}</p>
                <button onClick={() => removeFromCart(index)} className="text-red-500 text-sm">حذف</button>
              </div>
            ))}
            <div className="mt-8 font-bold text-xl">المجموع: {cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)} $</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}