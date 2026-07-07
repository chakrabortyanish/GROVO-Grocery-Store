import React, { useState, useEffect } from "react";
import "./Payment.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useContext } from "react";
import { CartContext } from "../../components/contextAPI/cartContext.jsx";

import { createOrder, verifyPayment } from "../../services/paymentService.js";
import { loadRazorpay } from "../../utils/loadRazorpay.js";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import { SiRazorpay } from "react-icons/si";

const Payment = () => {
  const navigate = useNavigate();

  const { totalProductsPrice, setTotalProductsPrice, cartItems, setCartItems } =
    useContext(CartContext);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        },
      );

      if (data.success) {
        setCartItems(data.items);
        setTotalProductsPrice(data.totalPrice);

        // Redirect to cart page if cart is empty
        if (cartItems.length === 0) {
          toast.warning("Your cart is empty.");
          navigate("/cart");
        }
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items");
    }
  };

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      const address = JSON.parse(localStorage.getItem("deliveryAddress")) || {};

      if (Object.keys(address).length === 0) {
        toast.warning("Please add delivery address.");
        return;
      }

      setLoading(true);

      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error("Unable to load Razorpay.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");

      const orderResponse = await createOrder(
        {
          items: cartItems.map((item) => ({
            product: item.productId,
            // eslint-disable-next-line no-undef
            itemTotal: item.cartQuantity * item.price,
            cartQuantity: item.cartQuantity,
          })),
          totalProductsPrice,
        },
        token,
      );

      if (!orderResponse.success) {
        toast.error(orderResponse.message);
        setLoading(false);
        return;
      }

      const razorpayOrder = orderResponse.razorpayOrder;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "Grovo",

        description: "Grocery Purchase",

        image: "https://grovo-grocery-store.vercel.app/image.png", // optional

        order_id: razorpayOrder.id,

        handler: async function (response) {
          try {
            const verify = await verifyPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cartItems.map((item) => ({
                  product: item.productId,
                  // eslint-disable-next-line no-undef
                  itemTotal: item.cartQuantity * item.price,
                  cartQuantity: item.cartQuantity,
                })),
                address,
                paymentMethod: "Razorpay",
                totalProductsPrice,
              },
              token,
            );

            if (verify.success) {
              toast.success("Payment Successful");

              await handleClearCart();

              setTimeout(() => {
                navigate("/orders");
              }, 1500);
            } else {
              toast.error(verify.message);
            }
          } catch (err) {
            console.log(err);
            toast.error("Verification Failed");
          } finally {
            setLoading(false);
          }
        },

        notes: {
          address: `${address.area}, ${address.city}`,
        },

        theme: {
          color: "#cc2eac",
        },

        modal: {
          ondismiss: function () {
            toast.info("Payment Cancelled");
            setLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        toast.error("Payment Failed");

        console.log(response.error);

        setLoading(false);
      });

      paymentObject.open();
    } catch (error) {
      console.error("Payment Error:", error);
      console.log(error);

      toast.error("Something went wrong.");

      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/clear`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to clear cart");
      }

      return;
    } catch (error) {
      console.error("Clear Cart Error:", error);
      throw error;
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* LEFT */}

        <div className="payment-left">
          <div className="payment-header">
            <button className="back-btn" onClick={() => navigate("/cart")}>
              ←
            </button>

            <h2>Payment</h2>
          </div>

          <div className="payment-card">
            <div className="razorpay-logo">
              <div className="payment-logo">
                <SiRazorpay />
              </div>
              <h2>Razorpay</h2>
            </div>

            <h3>Secure Checkout</h3>

            <p>Complete your payment safely with Razorpay.</p>

            <div className="payment-methods">
              <div>
                <span>✔</span>
                UPI
              </div>

              <div>
                <span>✔</span>
                Credit / Debit Card
              </div>

              <div>
                <span>✔</span>
                Net Banking
              </div>

              <div>
                <span>✔</span>
                Wallets
              </div>

              <div>
                <span>✔</span>
                EMI
              </div>
            </div>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading
                ? "Opening Razorpay..."
                : `Pay ₹ ${totalProductsPrice.toFixed(2)}`}
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div className="payment-right">
          <h2>Order Summary</h2>

          <div className="summary-box">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹ {totalProductsPrice.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <strong className="free">FREE</strong>
            </div>

            <div className="divider"></div>

            <div className="summary-row total">
              <span>Total</span>
              <strong>₹ {totalProductsPrice.toFixed(2)}</strong>
            </div>
          </div>

          <div className="security-card">
            <div className="security-icon">🔒</div>

            <div>
              <h4>100% Secure Payment</h4>
              <p>Powered by Razorpay</p>
            </div>
          </div>

          <div className="features">
            <div className="feature">
              🚚
              <span>Fast Checkout</span>
            </div>

            <div className="feature">
              🔐
              <span>Encrypted Payment</span>
            </div>

            <div className="feature">
              ⭐<span>Trusted by Millions</span>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Payment;
