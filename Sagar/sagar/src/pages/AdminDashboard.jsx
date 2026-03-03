import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

// ==================== API Helper Functions ====================

/**
 * Fetch all products from the backend
 */
const fetchAllProducts = async () => {
  const response = await fetch(`${BACKEND_URL}/api/products`);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

/**
 * Create a new product
 */
const createProduct = async (productData, token) => {
  const response = await fetch(`${BACKEND_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
};

/**
 * Update an existing product
 */
const updateProduct = async (id, productData, token) => {
  const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
};

/**
 * Delete a product
 */
const deleteProduct = async (id, token) => {
  const response = await fetch(`${BACKEND_URL}/api/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return response.json();
};

// ==================== Notification Component ====================

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
  }[type];

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "16px 24px",
        backgroundColor: bgColor,
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 9999,
        animation: "slideIn 0.3s ease",
      }}
    >
      {message}
    </div>
  );
};

// ==================== Form Modal Component ====================

const ProductFormModal = ({ isOpen, product, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.image) newErrors.image = "Image is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product?.id ? "Edit Product" : "Add New Product"}</h2>
          <button className="btn-close" onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name">
              Product Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Samsung 55' 4K Smart TV"
              disabled={isLoading}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product description..."
              rows="3"
              disabled={isLoading}
            />
          </div>

          {/* Price and Category */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Price (₹) <span className="required">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="49999"
                step="0.01"
                min="0"
                disabled={isLoading}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                <option value="Smart TVs">Smart TVs</option>
                <option value="Refrigerators">Refrigerators</option>
                <option value="Washing Machines">Washing Machines</option>
                <option value="Air Conditioners">Air Conditioners</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <span className="error-text">{errors.category}</span>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="form-group">
            <label htmlFor="image">
              Image URL <span className="required">*</span>
            </label>
            <input
              id="image"
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="e.g., tv2.avif"
              disabled={isLoading}
            />
            {errors.image && <span className="error-text">{errors.image}</span>}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : product?.id
                ? "Update Product"
                : "Add Product"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== Delete Confirmation Modal ====================

const DeleteConfirmModal = ({ isOpen, productName, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content modal-small"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Delete Product?</h2>
        <p>
          Are you sure you want to delete <strong>"{productName}"</strong>?
          This action cannot be undone.
        </p>
        <div className="form-actions">
          <button
            className="btn-delete-confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </button>
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== Admin Dashboard Main Component ====================

const AdminDashboard = ({ onLogout }) => {
  // -------- State Management --------
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);

  const [formModal, setFormModal] = useState({ isOpen: false, product: null });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: null,
  });

  const [toast, setToast] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);
  const [token, setToken] = useState(null);
  const [adminEmail, setAdminEmail] = useState("");

  // -------- Authorization Check --------
  useEffect(() => {
    const hasSession = !!localStorage.getItem("adminSession");
    const hasToken = !!localStorage.getItem("adminToken");
    
    // Both session and token must exist
    if (!hasSession || !hasToken) {
      setIsAdmin(false);
      setPageLoading(false);
      return;
    }
    setIsAdmin(true);
    setAdminEmail(localStorage.getItem("adminEmail") || "Admin");
  }, []);

  // -------- Fetch Products on Mount --------
    useEffect(() => {
      if (isAdmin && token) {
        loadProducts();
      }
    }, [isAdmin, token]);
  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin]);

  // -------- Load Products Handler --------
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(error.message || "Failed to load products", "error");
      setProducts([]);
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  // -------- Show Toast Notification --------
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // -------- Handle Open Form Modal --------
  const handleOpenAddForm = () => {
    setFormModal({ isOpen: true, product: null });
  };

  const handleOpenEditForm = (product) => {
    setFormModal({ isOpen: true, product });
  };

  const handleCloseForm = () => {
    setFormModal({ isOpen: false, product: null });
  };

  // -------- Handle Form Submit --------
  const handleFormSubmit = async (formData) => {
    try {
      setOperationLoading(true);

      if (formModal.product?.id) {
        // Update existing product
        await updateProduct(formModal.product.id, formData);
        showToast("✅ Product updated successfully", "success");
      } else {
        // Create new product
        await createProduct(formData);
        showToast("✅ Product created successfully", "success");
      }

      handleCloseForm();
      await loadProducts();
    } catch (error) {
      showToast(error.message || "Operation failed", "error");
    } finally {
      setOperationLoading(false);
    }
  };

  // -------- Handle Delete Product --------
  const handleOpenDeleteModal = (product) => {
    setDeleteModal({
      isOpen: true,
      productId: product.id,
      productName: product.name,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setOperationLoading(true);
      await deleteProduct(deleteModal.productId);
      showToast("✅ Product deleted successfully", "success");
      setDeleteModal({ isOpen: false, productId: null, productName: null });
      await loadProducts();
    } catch (error) {
      showToast(error.message || "Failed to delete product", "error");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: null, productName: null });
  };

  // -------- Handle Logout --------
  const handleLogout = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("adminToken");
      
      // Call logout endpoint with token in Authorization header
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.warn("Logout response not OK:", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all local session markers
      localStorage.removeItem("adminSession");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminName");
      localStorage.removeItem("adminToken");

      // Redirect by setting isAdmin to false
      setIsAdmin(false);
      showToast("Logged out successfully", "info");
      
      // Call parent logout handler if provided
      if (onLogout) {
        onLogout();
      }
      
      try { window.history.pushState({}, "", "/"); } catch(e) {}
    }
  };

  // -------- Render: Access Denied --------
  if (pageLoading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>🔒 Access Denied</h2>
          <p>You do not have permission to access the admin dashboard.</p>
          <p>Please sign in at the Admin login (go to <strong>/admin/login</strong>).</p>
        </div>
      </div>
    );
  }

  // -------- Render: Main Dashboard --------
  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>📦 Admin Dashboard - Product Management</h1>
        </div>
        <div className="header-right">
          <div className="admin-info">
            <span className="admin-email">📧 {adminEmail}</span>
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="header-stats">
        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <span className="stat-value">{products.length}</span>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Action Bar */}
      <div className="action-bar">
        <button
          className="btn btn-primary"
          onClick={handleOpenAddForm}
          disabled={operationLoading}
        >
          + Add New Product
        </button>
        <button
          className="btn btn-secondary"
          onClick={loadProducts}
          disabled={loading || operationLoading}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Products Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
            <button
              className="btn btn-primary"
              onClick={handleOpenAddForm}
            >
              + Add Your First Product
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="cell-id">{product.id}</td>
                    <td className="cell-name">
                      <strong>{product.name}</strong>
                    </td>
                    <td>
                      <span className="badge-category">{product.category}</span>
                    </td>
                    <td className="cell-price">₹{parseFloat(product.price).toLocaleString()}</td>
                    <td className="cell-description">
                      {product.description
                        ? product.description.substring(0, 50) + "..."
                        : "—"}
                    </td>
                    <td className="cell-image">{product.image}</td>
                    <td className="cell-actions">
                      <button
                        className="btn btn-edit btn-sm"
                        onClick={() => handleOpenEditForm(product)}
                        disabled={operationLoading}
                        title="Edit product"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-delete btn-sm"
                        onClick={() => handleOpenDeleteModal(product)}
                        disabled={operationLoading}
                        title="Delete product"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={formModal.isOpen}
        product={formModal.product}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isLoading={operationLoading}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        productName={deleteModal.productName}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
        isLoading={operationLoading}
      />
    </div>
  );
};

export default AdminDashboard;
