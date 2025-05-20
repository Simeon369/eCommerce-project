import React, { useState } from 'react'
import { client } from './sanityClient'

const AdminPage = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [inStock, setInStock] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload image to Sanity
      const imageAsset = await client.assets.upload('image', imageFile)

      // Create new product document
      await client.create({
        _type: 'product',
        title,
        price: parseFloat(price),
        inStock,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        },
      })

      alert('✅ Product added!')
      setTitle('')
      setPrice('')
      setInStock(true)
      setImageFile(null)
    } catch (error) {
      console.error('Upload error:', error)
      alert('❌ Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          required
          className="border p-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In Stock?
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default AdminPage
