import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaEye, 
  FaReceipt, 
  FaTruckFast, 
  FaCircleCheck, 
  FaXmark,
  FaBoxOpen,
  FaCreditCard
} from "react-icons/fa6"; 
import "./ManageOrders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from the backend using fetch()
  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/orders/allOrders?page=${page}&limit=10`;

      const response = await fetch(url, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      const resData = await response.json();

      // console.log(resData)
    
      if (!response.ok) {
        throw new Error(resData.message || "Failed to fetch orders");
      }

      if (resData.success) {
        console.log(resData.data)
        setOrders(resData.data);
        setPagination(resData.pagination);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  // Handle status update using fetch()
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/orders/update/${orderId}/status`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to update status");
      }

      if (resData.success) {
        toast.success(resData.message);
        
        // Live update local state array
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );

        // Sync local structural modal if currently open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "processing": return "status-select processing";
      case "shipped": return "status-select shipped";
      case "delivered": return "status-select delivered";
      case "cancelled": return "status-select cancelled";
      default: return "status-select pending";
    }
  };

  return (
    <div className="manage-orders-container">
      {/* Premium Header Design */}
      <div className="orders-header">
        <div className="header-title-wrapper">
          <div className="header-icon-box">
            <FaReceipt />
          </div>
          <div>
            <h1>Manage Orders</h1>
            <p>Monitor, track, and update customer orders dynamically.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <FaBoxOpen className="empty-icon" />
          <h3>No orders found</h3>
          <p>There are currently no customer transactions to display.</p>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Products Preview</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    {/* Order ID */}
                    <td className="order-id-cell">
                      <span className="id-badge">#{order._id.slice(-6).toUpperCase()}</span>
                    </td>

                    {/* Customer Info */}
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{order.address?.fullName || "Guest User"}</span>
                        <span className="customer-email">{order.userId?.email || ""}</span>
                      </div>
                    </td>

                    {/* Dynamic Inline Product Previews */}
                    <td>
                      <div className="products-preview-list">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <div className="preview-thumb-container" key={idx} title={item.product?.title || "Product"}>
                            <img 
                              src={item.product.image} 
                              alt={item.product?.title || 'Product'} 
                              className="preview-thumb"
                            />
                            <span className="thumb-qty">{item.cartQuantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="preview-thumb-more" title="More items">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="amount-cell">₹{order.totalAmount}</td>

                    {/* Payment Status Pill */}
                    <td>
                      <span className={`payment-status-tag ${order.paymentStatus?.toLowerCase() || 'pending'}`}>
                        <span className="dot"></span>
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Custom Styled Status Dropdown */}
                    <td>
                      <div className="select-wrapper">
                        <select
                          value={order.orderStatus || "Pending"}
                          className={getStatusBadgeClass(order.orderStatus)}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="text-center">
                      <button 
                        className="btn-view" 
                        onClick={() => setSelectedOrder(order)}
                        title="View Details"
                      >
                        <FaEye /> <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="pagination-container">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="pagination-btn"
              >
                <FaChevronLeft /> Prev
              </button>
              <span className="page-indicator">
                Page <strong>{pagination.currentPage}</strong> of {pagination.totalPages}
              </span>
              <button
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="pagination-btn"
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detailed Modal Quick View with Images */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Order Details</h2>
                <span className="modal-subtitle">ID: #{selectedOrder._id.toUpperCase()}</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                <FaXmark />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
                {/* Shipping Card */}
                <div className="modal-card">
                  <div className="card-header-icon pin-blue">
                    <FaTruckFast />
                  </div>
                  <h3>Shipping Address</h3>
                  <div className="card-details-content">
                    <p><strong>Name:</strong> {selectedOrder.address?.fullName}</p>
                    <p><strong>Phone:</strong> {selectedOrder.address?.phone}</p>
                    <p><strong>Area:</strong> {selectedOrder.address?.area}</p>
                    <p><strong>Destination:</strong> {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pin}</p>
                  </div>
                </div>

                {/* Transaction Card */}
                <div className="modal-card">
                  <div className="card-header-icon pin-purple">
                    <FaCreditCard />
                  </div>
                  <h3>Transaction Info</h3>
                  <div className="card-details-content">
                    <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                    <p>
                      <strong>Status: </strong> 
                      <span className={`modal-pay-badge ${selectedOrder.paymentStatus?.toLowerCase()}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                    <p className="truncated-text" title={selectedOrder.razorpayPaymentId}>
                      <strong>Razorpay ID:</strong> {selectedOrder.razorpayPaymentId || "N/A"}
                    </p>
                    <p className="truncated-text" title={selectedOrder.razorpayOrderId}>
                      <strong>Order Ref:</strong> {selectedOrder.razorpayOrderId || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Ordered Items Summary with Product Images */}
              <div className="modal-items-section">
                <h3>Items Summary ({selectedOrder.items?.length || 0})</h3>
                <div className="modal-items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="modal-item-row-advanced">
                      <div className="item-main-info">
                        <img 
                          src={item.product?.image || ''} 
                          alt={item.product?.title || 'Product Image'} 
                          className="modal-item-img"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                        />
                        <div className="item-meta">
                          <span className="item-title">{item.product?.name || "Unknown"}</span>
                          <span className="item-sku">Qty: <strong>{item.cartQuantity}</strong></span>
                        </div>
                      </div>
                      <div className="item-pricing">
                        {item.product?.price && (
                          <span className="item-unit-price">₹{item.product.price} each</span>
                        )}
                        <span className="item-price-total">₹{item.itemTotal}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modern Invoice Billing calculation */}
                <div className="modal-total-bar-container">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping Charges</span>
                    <span className="free-tag">FREE</span>
                  </div>
                  <hr className="summary-divider"/>
                  <div className="total-row grand-total">
                    <span>Grand Total:</span>
                    <strong>₹{selectedOrder.totalAmount}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;