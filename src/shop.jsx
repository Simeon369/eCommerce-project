import React, { useState, useEffect } from "react";
import Catalog from "./catalog";
import { useParams } from "react-router-dom";
import { client } from './sanityClient';



export default function Shop() {
   const { storeSlug } = useParams();
   const [storeName, setStoreName] = useState();

  useEffect(() => {
  const fetchStoreProducts = async () => {
    try {
      const userDoc = await client.fetch(
        `*[_type == "user" && storeSlug.current == $slug][0]{
          storeName
        }`,
        { slug: storeSlug }
      );

      if (userDoc) {
        setStoreName(userDoc.storeName);
        
      } else {
        console.warn("Store not found.");
      }
    } catch (err) {
      console.error("Error loading store:", err);
    }
  };

  if (storeSlug) {
    fetchStoreProducts();
  }
}, [storeSlug]);


  
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <header className="bg-green-600 text-white text-center p-4 text-2xl font-bold">
        {storeName}
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Menu</h1>

        <Catalog />

      </main>

      <footer className="text-center py-4 text-sm text-gray-500 mt-8">
        &copy; 2025 Get Sporty online shop. Powered by Simeon
      </footer>

      {/* {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg animate-bounce">
          ✅ Redirecting to WhatsApp...
        </div>
      )} */}

    </div>
  );
}
