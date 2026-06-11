export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-[#FFFFFF] border border-gray-100 p-8 rounded-[2rem] hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="h-56 bg-gray-50 rounded-2xl mb-6 overflow-hidden">
        <img src={product.image_url || "https://images.unsplash.com/photo-1526738546142-d69809313226"} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-2xl font-bold">{product.name}</h3>
      <p className="text-blue-600 font-black text-2xl my-4">{product.price} $</p>
      <button className="w-full bg-[#0A0A0A] text-white py-4 rounded-xl font-bold hover:bg-blue-600">تسوق الآن</button>
    </div>
  );
}