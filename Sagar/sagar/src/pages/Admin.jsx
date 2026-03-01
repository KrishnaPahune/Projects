import React, { useEffect, useState } from "react";
import "./Admin.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "tv2.avif",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const imageOptions = [
    "LGOLed55.jpg",
    "tv2.avif",
    "tv3.jpeg",
    "fridge1.png",
    "fridge2.jpg",
    "wm1.jpg",
    "wm2.webp",
    "ac1.webp",
  ];

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new product
  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "tv2.avif",
    });
    setShowForm(true);
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
    });
    setShowForm(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image: formData.image,
      };

      if (editingId) {
        // Update existing product
        const res = await fetch(`${BACKEND_URL}/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update product");
        setError("");
        alert("✅ Product updated successfully!");
      } else {
        // Add new product
        const res = await fetch(`${BACKEND_URL}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to add product");
        setError("");
        alert("✅ Product added successfully!");
      }

      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setError("");
      alert("✅ Product deleted successfully!");
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;

  return (
    <div className="admin-container">
      <h1>📦 Product Management</h1>

      {error && <div className="error-message">❌ {error}</div>}

      <button className="btn-primary" onClick={handleAdd}>
        + Add New Product
      </button>

      {/* Product Table */}
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No products found</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <div className="image-thumb">{product.image}</div>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price.toLocaleString()}</td>
                  <td>
                    <span className={`stock ${product.stock > 5 ? "in-stock" : "low-stock"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(product)}>
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => setDeleteConfirm(product.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Samsung 55' TV"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product details..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="49999"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Smart TVs">Smart TVs</option>
                    <option value="Refrigerators">Refrigerators</option>
                    <option value="Washing Machines">Washing Machines</option>
                    <option value="Air Conditioners">Air Conditioners</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Image *</label>
                  <select
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  >
                    {imageOptions.map((img) => (
                      <option key={img} value={img}>
                        {img}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingId ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <h2>Delete Product?</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="form-actions">
              <button
                className="btn-submit btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Yes, Delete
              </button>
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
