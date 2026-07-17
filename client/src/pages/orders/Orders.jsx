import React, { useEffect, useState } from "react";
import "./Orders.css";

import Footer from "../../components/footer/Footer";

import { downloadInvoice } from "../../services/orderService.js";
import { toast, ToastContainer } from "react-toastify";

import { 
  MdOutlineShoppingBag, 
  MdOutlineLocationOn,
  MdOutlineCloudDownload
} from "react-icons/md";

import { 
  FaCircleDot, 
  FaClock, 
  FaGear, 
  FaTruckFast, 
  FaCircleCheck, 
  FaCircleXmark 
} from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import "./Orders.css";

// Helper function to render tracking steps dynamically
const renderOrderTracker = (currentStatus) => {
  const statusLower = currentStatus?.toLowerCase() || "pending";
  
  if (statusLower === "cancelled") {
    return (
      <div className="tracker-wrapper cancelled-state">
        <div className="tracker-step active">
          <div className="step-icon-circle"><FaCircleXmark /></div>
          <span>Order Cancelled</span>
        </div>
      </div>
    );
  }

  const steps = [
    { label: "Pending", key: "pending", icon: <FaClock /> },
    { label: "Processing", key: "processing", icon: <FaGear className="spin-gear" /> },
    { label: "Shipped", key: "shipped", icon: <FaTruckFast /> },
    { label: "Delivered", key: "delivered", icon: <FaCircleCheck /> }
  ];

  const statusWeights = { pending: 0, processing: 1, shipped: 2, delivered: 3 };
  const currentWeight = statusWeights[statusLower] ?? 0;

  return (
    <div className="tracker-wrapper">
      <div className="tracker-progress-line">
        <div 
          className="tracker-progress-fill" 
          style={{ width: `${(currentWeight / 3) * 100}%` }}
        />
      </div>
      {steps.map((step, index) => {
        const isCompleted = index < currentWeight;
        const isActive = index === currentWeight;
        let stepClass = "tracker-step";
        if (isCompleted) stepClass += " completed";
        if (isActive) stepClass += " active";

        return (
          <div className={stepClass} key={step.key}>
            <div className="step-icon-circle">
              {isCompleted ? <FaCircleCheck /> : step.icon}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingInvoiceId, setGeneratingInvoiceId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/userOrders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownloadInvoice = async (id) => {
    setGeneratingInvoiceId(id);
    try {
      const pdfBlob = await downloadInvoice(id, token);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download invoice");
    } finally {
      setGeneratingInvoiceId(null);
    }
  };

  return (
    <>
      <div className="orders-page">
        <div className="orders-header">
          <div className="header-left">
            <div className="header-icon-box">
              <MdOutlineShoppingBag />
            </div>
            <div>
              <h1>My Purchases</h1>
              <p>Track delivery dispatch milestones and manage invoice receipts</p>
            </div>
          </div>
        </div>

        <div className="orders-content-main">
          {loading ? (
            <div className="loading-state">
              <div className="modern-spinner"></div>
              <p className="loading-text">Assembling order history records...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                alt="empty dashboard"
              />
              <h2>No Orders Found</h2>
              <p>You haven’t initialized any custom store transactions yet.</p>
            </div>
          ) : (
            <div className="orders-container">
              {orders.map((order) => (
                <div className="order-card" key={order._id}>
                  {/* Top Metadata Segment */}
                  <div className="order-top">
                    <div>
                      <span className="order-id-label">ORDER REFERRAL REGISTRY</span>
                      <h2>{order.razorpayOrderId || `#${order._id.slice(-8).toUpperCase()}`}</h2>
                    </div>
                    <div className="top-right">
                      <span className={`status-pill ${order.paymentStatus?.toLowerCase() === 'paid' ? 'paid' : 'unpaid'}`}>
                        <FaCircleDot /> {order.paymentStatus}
                      </span>
                      <span className="order-date">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Order Tracker Module */}
                  {renderOrderTracker(order.orderStatus)}

                  {/* Purchased Items List */}
                  <div className="products-list">
                    {order.items?.map((item) => (
                      <div className="product-item" key={item._id}>
                        <div className="product-left">
                          <img
                            src={item.product?.image || "https://via.placeholder.com/90"}
                            alt={item.product?.name || "Product Item"}
                          />
                          <div>
                            <h3>{item.product?.name || "Premium Store Product"}</h3>
                            <div className="badge-row">
                              <span className="order-quantity">
                                {item.product?.quantity} {item.product?.unit}
                              </span>
                              <span className="units-count-badge">
                                Quantity Ordered: <strong>{item.cartQuantity}</strong>
                              </span>
                            </div>
                          </div>
                        </div>
                        <h2 className="item-price-tag">₹{item.itemTotal}</h2>
                      </div>
                    ))}
                  </div>

                  {/* Lower Context Breakdown Split */}
                  <div className="order-bottom">
                    <div className="address-box">
                      <div className="address-title">
                        <MdOutlineLocationOn />
                        <h3>Delivery Address</h3>
                      </div>
                      <div className="address-details">
                        <div className="address-row">
                          <span className="address-key">Name:</span>
                          <span className="address-value font-highlight">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </span>
                        </div>
                        {Object.entries(order.address || {})
                          .filter(([key]) => key !== "fullName")
                          .map(([key, value]) => (
                            <div className="address-row" key={key}>
                              <span className="address-key">{key}:</span>
                              <span className="address-value">{value}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div id="summary-box">
                      <h3 className="summary-title">Billing Ledger</h3>
                      <div className="summary-row">
                        <span>Total Items</span>
                        <strong>{order.items?.length}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Payment</span>
                        <strong className="badge-payment-method">{order.paymentMethod}</strong>
                      </div>
                      <div className="summary-row total">
                        <span>Total Paid Amount</span>
                        <strong>₹ {order.totalAmount}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Modern Action Layout Footer */}
                  <button
                    className={`invoice-btn-modern ${generatingInvoiceId === order._id ? "generating" : ""}`}
                    disabled={generatingInvoiceId === order._id}
                    onClick={() => handleDownloadInvoice(order._id)}
                  >
                    <MdOutlineCloudDownload />
                    <span>
                      {generatingInvoiceId === order._id ? "Compiling PDF Records..." : "Download Certified Invoice"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" theme="colored" />
    </>
  );
};

export default Orders;
