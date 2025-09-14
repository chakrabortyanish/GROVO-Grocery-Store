import React from "react";
import "./Home.css";

import {
  AppDownload,
  Category,
  Client,
  Hero,
  Partner,
  Product,
} from "../../components/index.js";
import Footer from "../../components/footer/Footer.jsx";

const Home = () => {
  return (
    <div className="home">
      <div className="home-container">
        <Hero />
        <Category />
        <Product />
      </div>
      <Client />
      <div className="home-container">
        <Partner />
        <AppDownload />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
