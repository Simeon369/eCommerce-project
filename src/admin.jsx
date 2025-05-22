import React, { useEffect, useState } from "react";
import { client } from "./sanityClient";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    stock: 0,
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const query = `*[_type == "product"]{
      _id, title, price, stock,
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
      let imageAsset;

      if (form.image && !editingId) {
        imageAsset = await client.assets.upload("image", form.image, {
          filename: form.image.name,
          contentType: form.image.type,
        });
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
          title: form.title,
          price: parseFloat(form.price),
          stock: form.stock,
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          },
        });
      }

      setForm({
        title: "",
        price: "",
        stock: 0,
        image: null,
      });

      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (product) => {
    setForm({
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
      <h1 className="text-3xl font-bold mb-6">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4"
      >
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
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleChange}
            required
            className="block w-full"
          />
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
