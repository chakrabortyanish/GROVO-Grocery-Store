import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const adminToken = localStorage.getItem("adminToken")

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "1",
    unit: "",
    image: null,
     inStock: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      return toast.error("Product name is required");
    }

    if (!formData.category) {
      return toast.error("Please select a category");
    }

    if (!formData.price || Number(formData.price) <= 0) {
      return toast.error("Please enter a valid price");
    }

    if (!formData.quantity) {
      return toast.error("Please select quantity");
    }

    if (!formData.unit) {
      return toast.error("Please select unit");
    }

    if (!formData.image) {
      return toast.error("Please select an image");
    }

    if (!formData.inStock) {
  return toast.error("Please select stock status");
}

    try {
      setLoading(true);

      const form = new FormData();

      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("price", formData.price);
      form.append("quantity", formData.quantity);
      form.append("unit", formData.unit);
      form.append("image", formData.image);
      form.append("inStock", formData.inStock);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add product");
      }

      toast.success("Product Added Successfully");

      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        unit: "",
        image: null,
        inStock: "",
      });

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="product-card">
        <div className="page-header">
          <h1>Add New Product</h1>
          <p>Create and publish products for your store.</p>
        </div>

        <form className="product-form" onSubmit={addProduct}>
          {/* Product Name */}
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Fruits & Vegetables">
                Fruits & Vegetables
              </option>
              <option value="Medicine">Medicine</option>
              <option value="Beauty">Beauty</option>
              <option value="Baby Care">Baby Care</option>
              <option value="Gardening">Gardening</option>
              <option value="Stationary">Stationary</option>
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity</label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            >
              <option value="" selected>Select Quantity</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          {/* Unit */}
          <div className="form-group">
            <label>Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="">Select Unit</option>
              <option value="kg">KG</option>
              <option value="g">Gram</option>
              <option value="piece">Piece</option>
              <option value="box">Box</option>
              <option value="pack">Pack</option>
              <option value="ml">ML</option>
              <option value="liter">Liter</option>
              <option value="strip">Strip</option>
              <option value="bottle">Bottle</option>
            </select>
          </div>

          <div className="form-group">
  <label>Stock Status</label>

  <select
    name="inStock"
    value={formData.inStock}
    onChange={handleChange}
  >
    <option value="">Select Status</option>
    <option value="In Stock">In Stock</option>
    <option value="Out of Stock">Out of Stock</option>
  </select>
</div>

          {/* Image */}
          <div className="form-group">
            <label>Product Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default AddProduct;
