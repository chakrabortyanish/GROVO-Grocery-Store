import React, { useEffect, useState } from "react";
import "./Orders.css";

import { MdOutlineShoppingBag, MdOutlineLocationOn } from "react-icons/md";
import Footer from "../../components/footer/Footer";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/allOrders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="orders-page">
        {/* HEADER */}

        <div className="orders-header">
          <div className="header-left">
            <MdOutlineShoppingBag />

            <div>
              <h1>My Orders</h1>
              <p>Track and manage your purchases</p>
            </div>
          </div>
        </div>

        {/* EMPTY */}

        <div className="orders-content#124">
          {loading ? (
            <div class="loading-state">
              <div class="spinner"></div>
              <p class="loading-text">Loading your orders...</p>
            </div>
          ) : (
            <>
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                    alt="empty"
                  />

                  <h2>No Orders Yet</h2>

                  <p>You haven’t purchased anything yet.</p>
                </div>
              ) : (
                <div className="orders-container">
                  {orders.map((order) => (
                    <div className="order-card" key={order._id}>
                      {/* TOP */}

                      <div className="order-top">
                        <div>
                          <h2>Order ID</h2>

                          <p>#{order._id.slice(-8)}</p>
                        </div>

                        <div className="top-right">
                          <div className="status paid">
                            {order.paymentStatus}
                          </div>

                          <span>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* PRODUCTS */}

                      <div className="products-list">
                        {order.items.map((item) => (
                          <div className="product-item" key={item._id}>
                            <div className="product-left">
                              <img src={item.img} alt={item.name} />

                              <div>
                                <h3>{item.name}</h3>

                                <p>Quantity: {item.quentity}</p>
                              </div>
                            </div>

                            <h2>₹ {item.price * item.quentity}</h2>
                          </div>
                        ))}
                      </div>

                      {/* BOTTOM */}

                      <div className="order-bottom">
                        {/* ADDRESS */}

                        <div className="address-box">
                          <div className="address-title">
                            <MdOutlineLocationOn />

                            <h3>Delivery Address</h3>
                          </div>

                          <div className="address-details">
                            {Object.entries(order.address || {}).map(
                              ([key, value]) => (
                                <div className="address-row" key={key}>
                                  <span className="address-key">{key}</span>

                                  <span className="address-value">{value}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* SUMMARY */}

                        <div id="summary-box">
                          <div className="summary-row">
                            <span>Total Items</span>

                            <strong>{order.items.length}</strong>
                          </div>

                          <div className="summary-row">
                            <span>Payment</span>

                            <strong>{order.paymentMethod}</strong>
                          </div>

                          <div className="summary-row total">
                            <span>Total Amount</span>

                            <strong>₹ {order.totalAmount}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
