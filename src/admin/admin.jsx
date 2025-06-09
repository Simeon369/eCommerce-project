import React, { useEffect, useState, useNavigate } from "react";
import Nav from "./nav";
import { fetchProducts } from "./products";
import { client } from "../sanityClient";
import Settings from "./settings";
import ProductUpdate from "./product-update";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; 
import { logout } from "../auth/logout";




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
      image: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "number" ? Number(value) : value,
    }));
  };

  const [uid, setUid] = useState()


useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUid(user.uid)
        const fetchedProducts = await fetchProducts(uid);
        setProducts(fetchedProducts);
      } else {
        console.log("No user logged in.");
      }
    });

    return () => unsubscribe();
  }, []);



const [editingId, setEditingId] = useState(null);

  const handleEdit = (product) => {
    setForm({
      productId: product.productId, // Keep existing productId readonly
      title: product.title,
      price: product.price,
      stock: product.stock,
      image: product.imageUrl,
    });
    setEditingId(product.productId);
    console.log(product);
    
  };

  const handleDelete = async (productId) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    if (!uid) throw new Error("User not authenticated");

    // Fetch the user document ID
    const userDoc = await client.fetch(
      `*[_type == "user" && uid == $uid][0]{_id}`,
      { uid }
    );

    if (!userDoc?._id) throw new Error("User document not found.");

    // Patch the user document to remove the product from the products array
    await client
      .patch(userDoc._id)
      .unset([`products[productId == "${productId}"]`])
      .commit();

    // Refresh the product list
    
  } catch (err) {
    console.error("Delete error:", err.message);
    alert("Failed to delete product: " + err.message);
  }
};


  return (
    <div className="max-w-[500px]  mx-auto py-22 px-4 relative">
      <Nav toggleSettings={()=>toggleSettings} toggleProductUpdate={()=>toggleProductUpdate} logout={()=>logout}  />

    <div>
      <div className={`${isSetting ? 'block':'hidden' }`}>
        <Settings setIsSetting={setIsSetting} />
      </div>
      <div className={`${isProductUpdate ? 'block':'hidden' }`}>
        <ProductUpdate uid={uid} form={form} handleChange={handleChange} setProducts={setProducts} setForm={setForm} editingId={editingId} setEditingId={setEditingId} setIsProductUpdate={setIsProductUpdate} />
      </div>
    </div>

      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <div className="grid gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-gray-100 p-4 rounded shadow"
          >{console.log(product)}
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

              
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => {handleEdit(product); toggleProductUpdate()}}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.productId)}
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
