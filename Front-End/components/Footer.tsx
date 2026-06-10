import * as Icons from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div>
          <h2 className="text-white font-black text-2xl mb-6">TECH-RAISE</h2>
          <p className="text-sm">وجهتك الأولى لأحدث الأجهزة التقنية المبتكرة.</p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-6">روابط سريعة</h3>
          <ul className="space-y-4 text-sm">
            <li className="hover:text-blue-500 cursor-pointer">من نحن</li>
            <li className="hover:text-blue-500 cursor-pointer">سياسة الاسترجاع</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-6">تواصل معنا</h3>
          {/* <div className="flex gap-4">
            <Icons.Instagram className="w-5 h-5 cursor-pointer hover:text-white" />
            <Icons.Twitter className="w-5 h-5 cursor-pointer hover:text-white" />
            <Icons.Facebook className="w-5 h-5 cursor-pointer hover:text-white" />
          </div> */}
        </div>
      </div>
    </footer>
  );
}