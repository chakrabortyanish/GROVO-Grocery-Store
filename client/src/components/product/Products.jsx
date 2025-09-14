import React, { useContext } from "react";
import "./Products.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { products, bundle_products } from "../../allProducts.js";

import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/contextAPI/cartContext.jsx";

const Products = () => {
  const navigate = useNavigate();
  const { setCartCount } = useContext(CartContext);

  let handleCart = (e) => {
    const productId = String(e.currentTarget.id);
    const username = localStorage.getItem("Username");
    if (!username) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];

    let validateItem = storedItems.find((item) => String(item.id) == productId);
    console.log(validateItem);
    if (validateItem) {
      toast.warning("Product already added!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    let item = products.find((item) => String(item.id) == productId);
    let item2 = bundle_products.find((item) => String(item.id) == productId);
    if (item) storedItems.push(item);
    if (item2) storedItems.push(item2);

    localStorage.setItem("items", JSON.stringify(storedItems));
    setCartCount(storedItems.length);

    toast.success("Product added!", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  return (
    <div className="products-main">
      <div className="Popular-Product">
        <h2 className="title">Popular Product</h2>
        <div className="product">
          {products.map((item, i) => {
            return (
              <div className="item itemInfo" key={i}>
                <div className="image">
                  <img src={item.img} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <div className="weight">1 KG</div>
                <div className="price">Rs. {item.price}</div>
                <div className="add-to-cart" id={item.id} onClick={handleCart}>
                  Add to Cart
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/*  Popular Bundle Pack */}
      <section className="popular-bundle" id="packages">
        <h2 className="title">Popular Bundle Pack</h2>
        <div className="bundle-products">
          <div className="bunble-items">
            {bundle_products.map((item, i) => {
              return (
                <div className="itemInfo bundle-item" key={i}>
                  <div className="image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <h3>{item.name}</h3>
                  <div className="des">{item.des}</div>
                  <div className="price">Rs. {item.price}</div>
                  <div
                    className="add-to-cart"
                    id={item.id}
                    onClick={handleCart}
                  >
                    Add to Cart
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Products;
