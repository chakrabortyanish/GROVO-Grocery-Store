import React, { useState, useEffect } from "react";
import "./Payment.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useContext } from "react";
import { CartContext } from "../../components/contextAPI/cartContext.jsx";

const Payment = () => {
  const { totalProductsPrice, cartItems } = useContext(CartContext);
  // console.log("cartItems in Payment.jsx: ", cartItems);

  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formatted = value
        .replace(/\D/g, "")
        .substring(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();

      setCardData({
        ...cardData,
        [name]: formatted,
      });

      return;
    }

    if (name === "expiry") {
      let formatted = value.replace(/\D/g, "");

      if (formatted.length >= 3) {
        formatted = formatted.substring(0, 2) + "/" + formatted.substring(2, 4);
      }

      setCardData({
        ...cardData,
        [name]: formatted,
      });

      return;
    }

    if (name === "cvv") {
      setCardData({
        ...cardData,
        [name]: value.replace(/\D/g, "").substring(0, 3),
      });

      return;
    }

    setCardData({
      ...cardData,
      [name]: value,
    });
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const address = JSON.parse(localStorage.getItem("deliveryAddress")) || {};
    console.log("address: ", address);

    if (address && Object.keys(address).length === 0) {
      toast.info("Add address before payment");
      return;
    }

    const { cardName, cardNumber, expiry, cvv } = cardData;

    if (!cardName || !cardNumber || !expiry || !cvv) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // TOKEN
      const token = localStorage.getItem("token");

      // SEND TO BACKEND
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              product: item.productId,
              itemTotal: item.itemTotal,
              cartQuantity: item.cartQuantity,
            })),
            address,
            totalAmount: totalProductsPrice,
            paymentMethod: "Card",
            paymentStatus: "Paid",
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Payment Successful");
        await handleClearCart(); // Clear the cart after successful payment

        setTimeout(() => {
          window.location.href = "/orders";
        }, 3000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Payment Failed");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* LEFT */}

        <div className="payment-left">
          <div className="payment-header">
            <button onClick={() => (window.location.href = "/cart")}>🢠</button>
            <h2>Payment Details</h2>
          </div>

          {/* CARD PREVIEW */}

          <div className="atm-card">
            <div className="card-top">
              <h3>Grovo Bank</h3>
              <span>VISA</span>
            </div>

            <div className="chip"></div>

            <h1>{cardData.cardNumber || "XXXX XXXX XXXX XXXX"}</h1>

            <div className="card-bottom">
              <div>
                <p>Card Holder</p>
                <h4>{cardData.cardName || "YOUR NAME"}</h4>
              </div>

              <div>
                <p>Expires</p>
                <h4>{cardData.expiry || "MM/YY"}</h4>
              </div>
            </div>
          </div>

          {/* FORM */}

          <form onSubmit={handlePayment}>
            <div className="input-group">
              <label>Card Holder Name</label>

              <input
                type="text"
                name="cardName"
                placeholder="Anish Chakraborty"
                value={cardData.cardName}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Card Number</label>

              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="input-group">
                <label>Expiry Date</label>

                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>CVV</label>

                <input
                  type="password"
                  name="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit">Pay ₹ {totalProductsPrice.toFixed(2)}</button>
          </form>
        </div>

        {/* RIGHT */}

        <div className="payment-right">
          <h2>Order Summary</h2>

          <div className="summary-box">
            <div className="summary-row">
              <p>Subtotal</p>
              <span>₹ {totalProductsPrice.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <p>Delivery</p>
              <span>Free</span>
            </div>

            <div className="summary-row total">
              <p>Total</p>
              <span>₹ {totalProductsPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="secure-box">🔒 100% Secure Payment</div>
        </div>
      </div>

      <ToastContainer position="top-right"
        autoClose={2000}/>
    </div>
  );
};

export default Payment;
