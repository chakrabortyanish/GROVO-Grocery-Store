import React from "react";
import "./Category.css";

import {
  apple0,
  medicine,
  baby,
  beauty,
  office,
  Gardening
} from "../../assets/index.js";

const Category = () => {
  return (
    <div className="category" id="categories">
      <h2 className="title">Category</h2>
      <div className="con-item">
        <div className="item">
        <img src={office} alt="office" className="category-image"/>
        <h3>Stationary</h3>
      </div>
      <div className="item">
        <img src={medicine} alt="office" className="category-image"/>
        <h3>Medicine</h3>
      </div>
      <div className="item">
        <img src={beauty} alt="office" className="category-image"/>
        <h3>Beauty</h3>
      </div>
      <div className="item">
        <img src={apple0} alt="office" className="category-image"/>
        <h3>Stationary</h3>
      </div>
      <div className="item">
        <img src={baby} alt="Gardening" className="category-image"/>
        <h3>Baby Care</h3>
      </div>
      <div className="item">
        <img src={Gardening} alt="Gardening" className="category-image"/>
        <h3>Gardening</h3>
      </div>
      </div>
    </div>
  );
};

export default Category;
