import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard.jsx";
import "./CategoryProducts.css";
import Footer from "../../components/footer/Footer";
import { Navbar } from "../../components";

const Gardening = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGardeningProducts();
  }, []);

  const fetchGardeningProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/category/Gardening`
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

        <h2 className="title">Gardening</h2>

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
      </div>

      <Footer />
    </>
  );
};

export default Gardening;