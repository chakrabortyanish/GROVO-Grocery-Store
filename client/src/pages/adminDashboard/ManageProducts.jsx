import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("adminToken");

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/admin`,
        {
          mmethod: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    inStock: "",
    image: null,
  });

  const handleEdit = (product) => {
    setEditData({
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      inStock: product.inStock,
      image: null,
    });

    setShowEditModal(true);
  };

  const updateProduct = async () => {
    try {
      const form = new FormData();

      form.append("name", editData.name);
      form.append("category", editData.category);
      form.append("price", editData.price);
      form.append("quantity", editData.quantity);
      form.append("unit", editData.unit);
      form.append("inStock", editData.inStock);

      if (editData.image) {
        form.append("image", editData.image);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${editData._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      await fetchProducts();

      setShowEditModal(false);

      toast.success("Product Updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      await fetchProducts();

      toast.success("Product Deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="manage-products-page">
      <div className="manage-header">
        <div>
          <h1>Manage Products</h1>
          <p>{products.length} Products Available</p>
        </div>

        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
        />
      </div>

      <div className="products-table-card">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </td>

                <td>{product.name}</td>

                <td>
                  <span className="category-badge">{product.category}</span>
                </td>

                <td>₹{product.price}</td>

                <td>
                  {product.quantity} {product.unit}
                </td>

                <td>
                  <span
                    className={
                      product.inStock === "In Stock"
                        ? "stock-available"
                        : "stock-unavailable"
                    }
                  >
                    {product.inStock}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Edit section  */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Product</h2>

            <input
              type="text"
              value={editData.name}
              placeholder="Product Name"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="number"
              value={editData.price}
              placeholder="Price"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  price: e.target.value,
                })
              }
            />

            <select
              value={editData.category}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  category: e.target.value,
                })
              }
            >
              <option value="Fruits & Vegetables">Fruits & Vegetables</option>

              <option value="Medicine">Medicine</option>

              <option value="Beauty">Beauty</option>

              <option value="Baby Care">Baby Care</option>

              <option value="Gardening">Gardening</option>

              <option value="Stationary">Stationary</option>
            </select>

            <input
              type="number"
              value={editData.quantity}
              placeholder="Quantity"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  quantity: e.target.value,
                })
              }
            />

            <select
              value={editData.unit}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  unit: e.target.value,
                })
              }
            >
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

            <select
              value={editData.inStock}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  inStock: e.target.value,
                })
              }
            >
              <option value="In Stock">In Stock</option>

              <option value="Out of Stock">Out of Stock</option>
            </select>

            <input
              type="file"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  image: e.target.files[0],
                })
              }
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={updateProduct}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageProducts;
