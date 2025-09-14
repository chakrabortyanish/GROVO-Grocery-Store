import React, { useState, useRef } from "react";
import "./Hero.css";
import Navbar from "../header/Navbar";

import Slider from "react-slick";

import { toast, ToastContainer } from "react-toastify";

import { IoSearch } from "react-icons/io5";
import { bg1, bg2, bg } from "../../assets/index.js";

import { slide1, slide2, slide3, slide4 } from "../../assets/index.js";

const Hero = () => {
  const [showDeals, setShowDeals] = useState(false);
  const dealsRef = useRef(null);

  const handleOverlayClick = (e) => {
    /* console.log(dealsRef.current);
    console.log(dealsRef.current.contains(e.target)); */
    if (!dealsRef.current.contains(e.target)) {
      setShowDeals(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };
  return (
    <div className="hero">
      <Navbar />
      <div className="middle">
        <img src={bg1} alt="bg_image" className="bg1" />
        <img src={bg2} alt="bg_image" className="bg2" />
        <img src={bg} alt="bg_image" className="bg" />
        <div className="content">
          <h1>Order Your daily Groceries</h1>
          <h3>#Free Delivery</h3>
          <div className="search">
            <input type="text" placeholder="Search.." />
            <button>
              <IoSearch />
            </button>
          </div>
          <div className="best-deals" onClick={() => setShowDeals(true)}>
            Click here to learn about today's best deals
          </div>
        </div>
      </div>
      {/* best deals */}

      {showDeals && (
        <div className="deals-overlay" onClick={handleOverlayClick}>
          <div
            className="best-deals-container"
            ref={dealsRef}
          >
            <Slider {...settings} className="slider">
              <img src={slide1} alt="deal1" />
              <img src={slide2} alt="deal2" />
              <img src={slide3} alt="deal3" />
              <img src={slide4} alt="deal4" />
            </Slider>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Hero;
