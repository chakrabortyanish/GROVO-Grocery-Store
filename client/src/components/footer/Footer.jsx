import React from "react";
import "./Footer.css";

import { twitter, instagram, facebook, youtube } from "../../assets/index.js";

import store_icon from "../../assets/image.png";

import { LuPhone } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <ul className="main-links links">
            <li className="store-name">
              <img src={store_icon} alt="store_icon" />
              <span>Grovo</span>
            </li>
            <li className="images-link">
              <img src={twitter} alt="twitter" />
              <img src={instagram} alt="instragram" />
              <img src={facebook} alt="facebook" />
              <img src={youtube} alt="youtube" />
            </li>
          </ul>
          <ul className="links">
            <li className="head">Product</li>
            <li>Grocery</li>
            <li>Packages</li>
            <li>Popular</li>
            <li>New</li>
          </ul>
          <ul className="links">
            <li className="head">Category</li>
            <li>Beauty</li>
            <li>Vegetables</li>
            <li>Baby</li>
            <li>Medicine</li>
          </ul>
          <ul className="links">
            <li className="head">Contact</li>
            <li className="flex-link">
              <LuPhone /> +91 11067738422
            </li>
            <li className="flex-link">
              <HiOutlineMail /> Grovo@gmail.com
            </li>
            <li>Cities we serve</li>
          </ul>
        </div>
        <div className="copy-right">Copyright ©2025 | All Rights Reserved</div>
      </div>
    </div>
  );
};

export default Footer;
