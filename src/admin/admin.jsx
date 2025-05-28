import React, { useEffect, useState } from "react";
import Nav from "./nav";
import { fetchProducts } from "./products";
import { client } from "../sanityClient";
import Settings from "./settings";
import ProductUpdate from "./product-update";




export default function Admin() {
  
  const [products, setProducts] = useState([]);
  const [isSetting, setIsSetting]= useState(false)
  const toggleSettings = () => {
    setIsSetting(true)
    setIsProductUpdate(false)
    console.log(isSetting);
    
  }

  const [isProductUpdate, setIsProductUpdate]= useState(false)
  const toggleProductUpdate = () => {
    setIsProductUpdate(true)
    setIsSetting(false)
    
  }

  const handleShare = (product) => {
    const message = `🛒 Order Request

  Product: ${product.title}
  Price: ₦${product.price}
  Product ID: ${product.productId}

  Click to order: https://wa.me/${sellerPhoneNumber}?text=I want to order product ${product.productId}`;

    // open WhatsApp in new tab
    window.open(`https://wa.me/${sellerPhoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const [form, setForm] = useState({
      productId: "",
      title: "",
      price: "",
      stock: "",
      image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "number" ? Number(value) : value,
    }));
  };


useEffect(() =>{
  async function activate() {
    const products = await fetchProducts();
    setProducts(products)
  }
  activate()
}, [])



const [editingId, setEditingId] = useState(null);

  const handleEdit = (product) => {
    setForm({
      productId: product.productId, // Keep existing productId readonly
      title: product.title,
      price: product.price,
      stock: product.stock,
      image: null,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await client.delete(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleStockChange = async (id, currentStock, increment = true) => {
    const newStock = increment ? currentStock + 1 : Math.max(currentStock - 1, 0);
    try {
      await client.patch(id).set({ stock: newStock }).commit();
      fetchProducts();
    } catch (err) {
      console.error("Stock update error:", err);
    }
  };

  return (
    <div className="max-w-[500px]  mx-auto py-22 px-4 relative">
      <Nav toggleSettings={()=>toggleSettings} toggleProductUpdate={()=>toggleProductUpdate}  />

    <div>
      <div className={`${isSetting ? 'block':'hidden' }`}>
        <Settings setIsSetting={setIsSetting} />
      </div>
      <div className={`${isProductUpdate ? 'block':'hidden' }`}>
        <ProductUpdate form={form} handleChange={handleChange} setForm={setForm} editingId={editingId} setEditingId={setEditingId} setIsProductUpdate={setIsProductUpdate} />
      </div>
    </div>

      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <div className="grid gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex items-center gap-4 bg-gray-100 p-4 rounded shadow"
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-bold">{product.title}</h3>
              <p>₦{product.price}</p>
              <p className="text-gray-600">{product.stock} in stock</p>
              <p className="text-gray-400 text-sm">ID: {product.productId}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    handleStockChange(product._id, product.stock, true)
                  }
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  ➕ Increase
                </button>
                <button
                  onClick={() =>
                    handleStockChange(product._id, product.stock, false)
                  }
                  className="bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  ➖ Decrease
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => {handleEdit(product); toggleProductUpdate()}}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => handleShare(product)}
                className="bg-green-700 text-white px-3 py-1 rounded"
              >
                📤 Share
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
