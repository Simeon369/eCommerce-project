import React, { useState } from "react";


const products = [
  {
    name: "Grilled Boli",
    price: "₦1,000",
    image: "https://via.placeholder.com/300x200?text=Grilled+Boli",
    message: "Hi, I want to order Grilled Boli for ₦1000",
  },
  {
    name: "Spicy Fish",
    price: "₦2,500",
    image: "https://via.placeholder.com/300x200?text=Spicy+Fish",
    message: "Hi, I want to order Spicy Fish for ₦2500",
  },
];

export default function App() {
  const [showToast, setShowToast] = useState(false);
  const phoneNumber = "2348066983809"; // Replace with actual WhatsApp number

  const handleOrderClick = (message) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <header className="bg-green-600 text-white text-center p-4 text-2xl font-bold">
        🌶️ Boli Night Shop
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Menu</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-500 mb-2">{product.price}</p>
              <button
                onClick={() => handleOrderClick(product.message)}
                className="block w-full bg-green-500 text-white text-center py-2 rounded hover:bg-green-600 transition"
              >
                Order via WhatsApp
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-gray-500 mt-8">
        &copy; 2025 Boli Night Shop. Powered by YourName
      </footer>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce">
          ✅ Redirecting to WhatsApp...
        </div>
      )}

    </div>
  );
}
