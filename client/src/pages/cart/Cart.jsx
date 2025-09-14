import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CartContext } from "../../components/contextAPI/cartContext.jsx";

import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { setCartCount } = useContext(CartContext);

  const username = localStorage.getItem("Username");
  if (!username) {
    setTimeout(() => {
      navigate("/login");
    }, 1000);
    return;
  }
  const [cartItems, setCartItems] = useState([]);

  // Load data from localStorage when component mounts
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("items")) || [];
    setCartItems(stored);
  }, []);

  const handleRemove = (id) => {
    console.log(id.typeof);
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));

    toast.warning("Item removed from cart", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quentity,
    0
  );

  function handleCheckout() {
    localStorage.removeItem("items");
    setCartItems([]);
    setCartCount(0);
    toast.success("Order Confirmed!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  }

  const decrease = (id) => {
    const item = cartItems.find((i) => i.id === id);

    if (item && item.quentity === 1) {
      handleRemove(id); // this already updates state & localStorage
      return;
    }

    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        if (item.quentity && item.quentity > 1) {
          return { ...item, quentity: item.quentity - 1 };
        }
      }
      return item;
    });

    setCartItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  };

  const increase = (id) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        if (item.quentity) {
          return { ...item, quentity: item.quentity + 1 };
        }
      }
      return item;
    });

    setCartItems(updatedItems);
    localStorage.setItem("items", JSON.stringify(updatedItems));
  };

  return (
    <div className="main-cart-container">
      <h2 className="header-name">
        <span>
          Shop<span>ping</span>
        </span>{" "}
        Cart
      </h2>
      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty.</h2>
            <Link to="/">Go to home</Link>
          </div>
        ) : (
          <div className="cart-items">
            <div className="cart-items-container">
              {cartItems.map((item, i) => (
                <div className="product-container" key={i}>
                  <div className="cart-item">
                    <img src={item.img} alt={item.name} width="100" />
                    <div className="product-info">
                      <div className="top">
                        <h3>{item.name}</h3>
                        <div className="qty">
                          {item.weight ? (
                            <div className="weight">{item.quentity} KG</div>
                          ) : (
                            <div className="qt">
                              <span>Qty: {item.quentity}</span>
                            </div>
                          )}
                          <div className="set-qty">
                            <button
                              className="dec"
                              onClick={() => decrease(item.id)}
                            >
                              {item.quentity == 1 ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="20px"
                                  viewBox="0 -960 960 960"
                                  width="17px"
                                  fill="#ff0808ff"
                                >
                                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                </svg>
                              ) : (
                                "-"
                              )}
                            </button>
                            <span>{item.quentity}</span>
                            <button
                              className="inc"
                              onClick={() => increase(item.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="stock">In stock</p>
                    </div>
                    <div className="right-box">
                      <p>
                        ₹{" "}
                        {(Number(item.price) * (item.quentity || 1)).toFixed(2)}
                      </p>
                      <button onClick={() => handleRemove(item.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#e3e3e3"
                        >
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-box">
              <div className="checkout-info">
                <h2>
                  Name: <span>{username}</span>
                </h2>
                <p className="total-pro">
                  Total products: <span>{cartItems.length}</span>
                </p>
                <p>
                  Total price: <span>₹ {totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <button onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Cart;
