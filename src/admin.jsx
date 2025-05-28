import React, { useEffect, useState } from "react";
import { client } from "./sanityClient";
import ImageUpload from "./imageUpload";


async function generateProductId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 6;

  const generateId = () => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  while (true) {
    const newId = generateId();
    const existing = await client.fetch(
      `*[_type == "product" && productId == $newId]`,
      { newId }
    );
    if (existing.length === 0) return newId;
  }
}

export default function Admin() {
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    title: "",
    price: "",
    stock: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();

    // Only generate new productId if NOT editing
    if (!editingId) {
      (async () => {
        const id = await generateProductId();
        setForm((f) => ({ ...f, productId: id }));
      })();
    }
  }, [editingId]);

  const sellerPhoneNumber = "2348066983809"; // replace with your WhatsApp number

  const handleShare = (product) => {
    const message = `🛒 Order Request

  Product: ${product.title}
  Price: ₦${product.price}
  Product ID: ${product.productId}

  Click to order: https://wa.me/${sellerPhoneNumber}?text=I want to order product ${product.productId}`;

    // open WhatsApp in new tab
    window.open(`https://wa.me/${sellerPhoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };


  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Fetch existing config
  useEffect(() => {
    const fetchStoreConfig = async () => {
      const config = await client.fetch(`*[_type == "storeConfig"][0]`);
      if (config) {
        setStoreName(config.storeName);
        setPhoneNumber(config.phoneNumber);
      }
    };
    fetchStoreConfig();
  }, [])

  // Update storeConfig
  const handleProfileChange = async (e) => {
  e.preventDefault();
  try {
    // Step 1: Ensure the document exists (create if not)
    await client.createIfNotExists({
      _id: "storeConfig",
      _type: "storeConfig",
      storeName,
      phoneNumber,
    });

    // Step 2: Update it
    await client
      .patch("storeConfig")
      .set({
        storeName,
        phoneNumber,
      })
      .commit();

    alert("Store settings updated!");
  } catch (err) {
    console.error("Update error:", err);
    alert("Error updating settings.");
  }
};



  const fetchProducts = async () => {
    const query = `*[_type == "product"]{
      _id, productId, title, price, stock,
      "imageUrl": image.asset->url
    }`;
    try {
      const data = await client.fetch(query);
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageRef = null;
      if (imageFile) {
        const asset = await client.assets.upload("image", imageFile);
        imageRef = {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        };
      }

      if (editingId) {
        await client
          .patch(editingId)
          .set({
            title: form.title,
            price: parseFloat(form.price),
            stock: form.stock,
          })
          .commit();
        setEditingId(null);
      } else {
        await client.create({
          _type: "product",
          productId: form.productId,
          title: form.title,
          price: parseFloat(form.price),
          stock: form.stock,
          image: imageRef,
        });
      }

      // Reset form and imageFile
      setForm({
        productId: "",
        title: "",
        price: "",
        stock: "",
        image: null,
      });
      setImageFile(null);

      // Generate new productId for next product
      const newId = await generateProductId();
      setForm((f) => ({ ...f, productId: newId }));

      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

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
    <div className="max-w-3xl mx-auto py-10 px-4">

      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Store Settings</h2>
      <form onSubmit={handleProfileChange} className="space-y-4">
        <div>
          <label className="block font-semibold">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>

      <h1 className="text-3xl font-bold mb-6">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4"
      >
        <label htmlFor="productId">Product ID</label>
        <input
          name="productId"
          value={form.productId}
          readOnly
          className="w-full border border-gray-300 p-2 rounded bg-gray-100 cursor-not-allowed"
          placeholder="Product ID"
        />

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Title"
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (₦)"
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Number in Stock"
          required
          className="w-full border border-gray-300 p-2 rounded"
        />

        {!editingId && (
          <ImageUpload onImageCropped={(file) => setImageFile(file)} />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

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
                onClick={() => handleEdit(product)}
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
