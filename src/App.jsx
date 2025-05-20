import React, { useState } from "react";
import fish from './assets/fish.jpeg'
import boli from './assets/boli.jpeg'
import Catalog from "./catalog";


const products = [
  {
    name: "Grilled Boli",
    price: "₦1,000",
    image: boli,
    message: "Hi, I want to order Grilled Boli for ₦1000",
  },
  {
    name: "Spicy Fish",
    price: "₦2,500",
    image: fish,
    message: "Hi, I want to order Spicy Fish for ₦2500",
  },
];

export default function App() {
  
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <header className="bg-green-600 text-white text-center p-4 text-2xl font-bold">
        🌶️ Boli Night Shop
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Menu</h1>

        <Catalog />

      </main>

      <footer className="text-center py-4 text-sm text-gray-500 mt-8">
        &copy; 2025 Boli Night Shop. Powered by YourName
      </footer>

      {/* {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce">
          ✅ Redirecting to WhatsApp...
        </div>
      )} */}

    </div>
  );
}
