import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { CartContext } from "../../components/contextAPI/cartContext.jsx";

import "./Cart.css";
import store_icon from "../../assets/image.png";

import Footer from "../../components/footer/Footer.jsx";
import UserMenu from "../../components/userMenu/UserMenu.jsx";

import axios from "axios";

const Cart = () => {
  const userToken = localStorage.getItem("token");
  const { setTotalProductsPrice, totalProductsPrice, cartItems, setCartItems } =
    useContext(CartContext);

  const navigate = useNavigate();

  if (!userToken) {
    setTimeout(() => {
      navigate("/login");
    }, 1000);
    return;
  }

  const { firstName, lastName } = userToken ? jwtDecode(userToken) : {};

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showAddressForm, setShowAddressForm] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [address, setAddress] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("deliveryAddress")) || {
        fullName: firstName+" "+lastName || "",
        area: "",
        city: "",
        state: "",
        pin: "",
        phone: "",
      }
    );
  });

  // fetch cart items

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        },
      );

      if (data.success) {
        // console.log("Fetched cart items:", data.items);
        setCartItems(data.items);
        setTotalProductsPrice(data.totalPrice);
        setLoading(false);
      }
    } catch (error) {
      // console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items");
    }
  };

  // Load data from localStorage when component mounts
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchCartItems();
    const stored = JSON.parse(localStorage.getItem("items")) || [];
    setCartItems(stored);
  }, []);

  function handleCheckout() {
    if (localStorage.getItem("deliveryAddress") === null) {
      toast.warning("Please add a delivery address before checkout");
      return;
    }
    navigate("/payment");
  }

  // increase cart quantity
  const increaseQuantity = async (productId) => {
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/increase/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        },
      );

      if (data.success) {
        await fetchCartItems();
        toast.success(data.message);
      }

      // Fetch cart again here if needed
      // getCart();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to increase quantity",
      );
    }
  };

  // decrease cart quantity
  const decreaseQuantity = async (productId) => {
    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/decrease/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        },
      );

      if (data.success) {
        await fetchCartItems();
        toast.success(data.message);
      }

      // Fetch cart again here if needed
      // getCart();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to decrease quantity",
      );
    }
  };

  // Remove Product
  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        },
      );

      if (data.success) {
        await fetchCartItems();
        toast.success(data.message);
      }

      // Fetch cart again here if needed
      // getCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove product");
    }
  };

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = () => {
    localStorage.setItem("deliveryAddress", JSON.stringify(address));

    toast.success("Address Updated Successfully");

    setShowAddressForm(false);
  };

  // loading state
  const [loading, setLoading] = useState(true);

  return (
    <div className="main-cart-container">
      {/* NAVBAR */}
      <nav className="cart-navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <img src={store_icon} alt="Grovo" />
            <h1>Grovo</h1>
          </Link>

          <div className="nav-right">
            <UserMenu />
            <Link to="/" id="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </nav>

      {loading ? (
        <div class="loading-state">
          <div class="spinner"></div>
          <p class="loading-text">Loading your cart...</p>
        </div>
      ) : (
        <div className="cart-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              {/* ADDRESS BAR */}
              <div className="address-bar">
                <div className="address-left">
                  <span className="deliver-text">Deliver to:</span>

                  <span className="user-name">
                    {firstName} {lastName}
                  </span>

                  <span className="user-address">
                    {address.area || "Your Area"}, {address.city || "Your City"}
                    , {address.state || "West Bengal"} -{" "}
                    {address.pin || "700001"}, Phone:{" "}
                    {address.phone || "+91 0000000000"}
                  </span>
                </div>

                <button
                  className="change-address-btn"
                  onClick={() => setShowAddressForm(true)}
                >
                  Change
                </button>
              </div>
              {/* end ADDRESS BAR */}

              <h2>Your cart is empty.</h2>
              <Link to="/">Go to home</Link>
            </div>
          ) : (
            <div className="cart-items">
              <div className="cart-items-container">
                {/* ADDRESS SECTION */}
                <div className="address-box">
                  <div className="address-top">
                    <div>
                      <h3>Delivery Address</h3>

                      <p style={{ fontWeight: 500 }}>
                        {firstName} {lastName}
                      </p>

                      <p>
                        {address.area || "Your Area"},{" "}
                        {address.city || "Your City"}
                      </p>

                      <p>
                        {address.state || "West Bengal"} -{" "}
                        {address.pin || "700001"}
                      </p>

                      <p>Phone: {address.phone || "+91 0000000000"}</p>
                    </div>

                    <button onClick={() => setShowAddressForm(true)}>
                      Change
                    </button>
                  </div>
                </div>
                {/* ADDRESS END */}

                {cartItems.map((item, i) => (
                  <div className="product-container" key={i}>
                    <div className="cart-item">
                      <img src={item.image} alt={item.name} width="100" />
                      <div className="product-info">
                        <div className="top">
                          <h3>{item.name}</h3>
                          <div className="qty">
                            <div className="item-unit">
                              {item.quantity} {item.unit}
                            </div>
                            <div className="qt">
                              <span>Qty: {item.cartQuantity}</span>
                            </div>
                            <div className="set-qty">
                              {item.cartQuantity == 1 ? (
                                <button
                                  className="dec"
                                  onClick={() => removeFromCart(item.productId)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="17px"
                                    fill="#ff0808ff"
                                  >
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  className="dec"
                                  onClick={() =>
                                    decreaseQuantity(item.productId)
                                  }
                                >
                                  -
                                </button>
                              )}
                              <span>{item.cartQuantity}</span>
                              <button
                                className="inc"
                                onClick={() => increaseQuantity(item.productId)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <p
                          className={`${item.inStock === "In Stock" ? "in-stock" : "out-of-stock"}`}
                        >
                          {item.inStock}
                        </p>
                      </div>
                      <div className="right-box">
                        <p>₹ {item.itemTotal}</p>
                        <button onClick={() => removeFromCart(item.productId)}>
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
                    Name: <span>{firstName}</span>
                  </h2>
                  <p className="total-pro">
                    Total products: <span>{cartItems.length}</span>
                  </p>
                  <p>
                    Total price: <span>₹ {totalProductsPrice.toFixed(2)}</span>
                  </p>
                </div>
                <button onClick={handleCheckout}>Checkout</button>
              </div>
            </div>
          )}

          {showAddressForm && (
            <div className="address-modal">
              <div className="address-form">
                <h2>Update Address</h2>

                <input
                  type="text"
                  name="area"
                  placeholder="Area"
                  value={address.area}
                  onChange={handleAddressChange}
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleAddressChange}
                />

                <input
                  type="text"
                  name="pin"
                  placeholder="Pin Code"
                  value={address.pin}
                  onChange={handleAddressChange}
                />

                <input
                  min={10}
                  max={10}
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={handleAddressChange}
                />

                <div className="address-btns">
                  <button onClick={saveAddress}>Save Address</button>

                  <button
                    className="cancel-btn"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={1000} />
      <div style={{ marginTop: "60px" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Cart;
