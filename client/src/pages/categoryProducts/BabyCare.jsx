import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard.jsx";
import "./CategoryProducts.css";
import { Navbar } from "../../components";
import Footer from "../../components/footer/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BabyCare = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBabyCareProducts();
  }, []);

  const fetchBabyCareProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/category/Baby Care`
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="category-container">
        <Navbar />

        <h2 className="title">Baby Care</h2>

        <div className="product-grid">
          {loading ? (
            <h3>Loading Products...</h3>
          ) : products.length === 0 ? (
            <h3 class="no-products">No Products Found</h3>
          ) : (
            products.map((item) => (
              <ProductCard
                key={item._id}
                item={item}
              />
            ))
          )}
        </div>
        <ToastContainer position="top-right" autoClose={1500} />
      </div>

      <Footer />
    </>
  );
};

export default BabyCare;