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

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [address, setAddress] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("deliveryAddress")) || {
        /* fullName: firstName || "", */
        area: "",
        city: "",
        state: "",
        pin: "",
        phone: "",
      }
    );
  });

  // Load data from localStorage when component mounts
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("items")) || [];
    setCartItems(stored);
  }, []);

  const navigate = useNavigate();
  const { setCartCount } = useContext(CartContext);

  const token = localStorage.getItem("token");
  const { firstName, lastName } = token ? jwtDecode(token) : {};

  if (!token) {
    setTimeout(() => {
      navigate("/login");
    }, 1000);
    return;
  }

  const handleRemove = (id) => {
    // console.log(id.typeof);
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
    0,
  );

  function handleCheckout() {
    if(localStorage.getItem("deliveryAddress") === null){
      toast.warning("Please add a delivery address before checkout",);
      return;
    }
    navigate("/payment");
    /* localStorage.removeItem("items");
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
    }); */
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

  return (
    <div className="main-cart-container">
      {/* NAVBAR */}
      <nav className="cart-navbar">
        <div className="nav-container">
          <div className="logo">
            <img src={store_icon} alt="Grovo" />
            <h1>Grovo</h1>
          </div>

          <div className="nav-right">
            <UserMenu />
            <Link to="/" id="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </nav>

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
                  {address.area || "Your Area"}, {address.city || "Your City"},{" "}
                  {address.state || "West Bengal"} - {address.pin || "700001"}
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

                    <p>{address.phone || "+91 0000000000"}</p>
                  </div>

                  <button onClick={() => setShowAddressForm(true)}>
                    Change
                  </button>
                </div>
              </div>

              {/* ADDRESS MODAL */}

              {showAddressForm && (
                <div className="address-modal">
                  <div className="address-form">
                    <h2>Update Address</h2>

                    {/* <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={address.fullName}
                      onChange={handleAddressChange}
                    /> */}

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
                      type="text"
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
                              id="dec"
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
                  Name: <span>{firstName}</span>
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
      <div style={{ marginTop: "60px" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Cart;
