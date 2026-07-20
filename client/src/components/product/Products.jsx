import React, { useEffect, useState } from "react";
import "./Products.css";
// import order css file to use the same loading spinner
import "../../pages/orders/Orders.css";

import "react-toastify/dist/ReactToastify.css";
import ProductCard from "../ProductCard.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
          {
            method: "GET",
          }
        );
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 1. Filter out items where unit === "pack" for the Popular Products grid
  const regularProducts = products.filter((item) => item.unit !== "pack");

  // 2. Pagination logic for regular products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = regularProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(regularProducts.length / productsPerPage) || 1;

  // 3. Filter items for Popular Bundle Pack section
  const bundleProducts = products.filter((item) => item.unit === "pack");

  return (
    <div className="products-main">
      {/* Popular Product Section */}
      <div className="Popular-Product">
        <h2 className="title">Popular Product</h2>
        {loading ? (
          <div className="loading-state" id="loading-state">
            <div className="spinner" id="spinner"></div>
            <p className="loading-text">Loading Products...</p>
          </div>
        ) : (
          <>
            <div className="product">
              {currentProducts.map((item) => (
                <ProductCard item={item} key={item._id || item.id} />
              ))}
            </div>

            {/* Pagination buttons */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span>
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Popular Bundle Pack Section */}
      {bundleProducts.length > 0 && (
        <section className="popular-bundle" id="packages">
          <h2 className="title">Popular Bundle Pack</h2>
          <div className="bundle-products">
            <div className="bunble-items">
              {bundleProducts.map((item) => (
                <ProductCard item={item} key={item._id || item.id} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Products;
