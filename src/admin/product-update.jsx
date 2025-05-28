import React , {useState, useEffect} from 'react'
import ImageUpload from "../imageUpload";
import { fetchProducts } from "./products";
import { client } from "../sanityClient";

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

const productUpdate = ({form, handleChange, setForm, editingId, setEditingId, setIsProductUpdate}) => {
      
  const [imageFile, setImageFile] = useState(null);
  
  
  

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
        setIsProductUpdate(false)

        // Generate new productId for next product
        const newId = await generateProductId();
        setForm((f) => ({ ...f, productId: newId }));

        fetchProducts();
        } catch (err) {
        console.error("Submit error:", err);
        }
    };





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

     
  return (
    <div>
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
      
    </div>
  )
}

export default productUpdate
