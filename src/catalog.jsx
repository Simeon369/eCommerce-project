import React, { useEffect, useState } from "react";
import { client } from "./sanityClient";
import { auth } from "../firebase"; // Make sure this is the correct path
import { onAuthStateChanged } from "firebase/auth";
import { getUserStoreInfo } from "./constants";
import { useParams } from "react-router-dom";

const Catalog = () => {
  const { storeSlug } = useParams();
  const [phoneNumber, setPhoneNumber] = useState();

      useEffect(() => {
      const fetchStoreProducts = async () => {
        try {
          const userDoc = await client.fetch(
            `*[_type == "user" && storeSlug.current == $slug][0]{
              phoneNumber,
              products[] {
                title,
                price,
                stock,
                productId,
                "imageUrl": image.asset->url
              }
            }`,
            { slug: storeSlug }
          );
    
          if (userDoc) {
            setPhoneNumber(userDoc.phoneNumber);
            setProducts(userDoc.products || []);
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

  const handleOrderClick = (message) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await client.fetch(
            `*[_type == "user" && uid == $uid][0]{
              products[] {
                productId,
                title,
                price,
                stock,
                "imageUrl": image.asset->url
              }
            }`,
            { uid: user.uid }
          );
          setProducts(userData?.products || []);
        } catch (err) {
          console.error("Sanity fetch error:", err.message);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
      {products.map((product, index) => (
        <div
          key={index}
          className={`bg-white ${
            product.stock === 0 ? "hidden" : "block"
          } rounded-xl shadow p-4`}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full rounded"
          />
          <h2 className="text-lg font-bold mt-2">{product.title}</h2>

          <div className="flex justify-between items-center py-2">
            <p className="text-gray-700 text-xl font-bold">₦{product.price}</p>
            <p className="text-sm text-green-600">
              {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
            </p>
          </div>

          <button
            onClick={() =>
              handleOrderClick(
                `Hi, I want to order ${product.title} for #${product.price}. [${product.productId}]`
              )
            }
            className="block w-full bg-green-500 text-white text-center py-2 rounded hover:bg-green-600 transition"
          >
            Order via WhatsApp
          </button>
        </div>
      ))}
    </div>
  );
};

export default Catalog;
