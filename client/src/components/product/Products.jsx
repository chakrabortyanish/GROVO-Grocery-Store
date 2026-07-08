import React, { /*  useContext, */ useEffect, useState } from "react";
import "./Products.css";
// import order css file to use the same loading spinner
import "../../pages/orders/Orders.css";

// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { /* products, */ bundle_products } from "../../allProducts.js";

// import { useNavigate } from "react-router-dom";
import { CartContext } from "../../components/contextAPI/cartContext.jsx";
import ProductCard from "../ProductCard.jsx";

const Products = () => {
  // const navigate = useNavigate();
  // const { setCartCount } = useContext(CartContext);

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
          },
        );
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  //pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="products-main">
      <div className="Popular-Product">
        <h2 className="title">Popular Product</h2>
        {loading ? (
          <div class="loading-state" id="loading-state">
            <div class="spinner" id="spinner"></div>
            <p class="loading-text">Loading Products...</p>
          </div>
        ) : (
          <>
            <div className="product">
              {currentProducts.map((item, i) => {
                return <ProductCard item={item} key={i} />;
              })}
            </div>
            {/* Pagination buttons */}
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
          </>
        )}
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
                  <div className="add-to-cart" id={item.id}>
                    Add to Cart
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
