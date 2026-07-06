import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard.jsx";
// import { beautyProducts } from "../data/beautyProducts";
import "./CategoryProducts.css";
import Footer from "../../components/footer/Footer";
import { Navbar } from "../../components";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Beauty = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeautyProducts();
  }, []);

  const fetchBeautyProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/category/Beauty`,
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

        <h2 className="title">Beauty & Personal Care</h2>

        <div className="product-grid">
          {loading ? (
            <h3>Loading...</h3>
          ) : products.length === 0 ? (
            <h3 class="no-products">No Products Found</h3>
          ) : (
            products.map((item) => <ProductCard key={item._id} item={item} />)
          )}
        </div>
        <ToastContainer position="top-right" autoClose={1500} />
      </div>

      <Footer />
    </>
  );
};

export default Beauty;
