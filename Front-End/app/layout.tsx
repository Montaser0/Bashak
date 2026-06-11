// app/layout.tsx
import './globals.css';
import { Outfit } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '600', '900'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${outfit.className} bg-[#FAFAFA]`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}