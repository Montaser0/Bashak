// components/Header.tsx
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tighter text-blue-600">TECH-RAISE</h1>
        
        <nav className="hidden md:flex gap-8 font-medium text-gray-600">
          <a href="#" className="hover:text-blue-600 transition">الرئيسية</a>
          <a href="#" className="hover:text-blue-600 transition">الأجهزة</a>
          <a href="#" className="hover:text-blue-600 transition">عروض التقنية</a>
        </nav>

        <div className="flex gap-4 items-center text-gray-700">
          <Search className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          <User className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-blue-600" />
          <Menu className="md:hidden w-6 h-6" />
        </div>
      </div>
    </header>
  );
}