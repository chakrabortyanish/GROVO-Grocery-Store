import React from "react";
import "./Client.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { client1, client2, client3 } from "../../assets/index.js";


const Client = () => {

 const settings_2 = {
  dots: true,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


  return (
    <div className="client">
      <div className="client-container">
        <h1 className="title">What Our Clients Say</h1>
        <div className="client-feedback">
          <Slider {...settings_2} className="custom-slider">
            <div className="clt">
            <div className="profile">
              <img src={client1} alt="" />
              <div className="name">
                <h3>Ava Alex</h3>
                <div className="job">Marketer</div>
              </div>
            </div>
            <div className="feedback">
              At Grovo Grocery Store, you can get fresh fruits and vegetables.
              And it is not only about fruits or vegetables, you can buy all
              kinds of stuff here.
            </div>
          </div>
          <div className="clt">
            <div className="profile">
              <img src={client2} alt="" />
              <div className="name">
                <h3>James Mcavoy</h3>
                <div className="job">Marketer</div>
              </div>
            </div>
            <div className="feedback">
              At Grovo Grocery Store, you can get fresh fruits and vegetables.
              And it is not only about fruits or vegetables, you can buy all
              kinds of stuff here.
            </div>
          </div>
          <div className="clt">
            <div className="profile">
              <img src={client3} alt="" />
              <div className="name">
                <h3>Sameer Sharma</h3>
                <div className="job">Software Developer</div>
              </div>
            </div>
            <div className="feedback">
              Grovo Grocery Store is the best. CGS never fails to dissapoint me.
              Grocery shopping has become so easy with Grovo Grocery Store.
            </div>
          </div>
           <div className="clt">
            <div className="profile">
              <img src={client2} alt="" />
              <div className="name">
                <h3>James Mcavoy</h3>
                <div className="job">Marketer</div>
              </div>
            </div>
            <div className="feedback">
              At Grovo Grocery Store, you can get fresh fruits and vegetables.
              And it is not only about fruits or vegetables, you can buy all
              kinds of stuff here.
            </div>
          </div>
           <div className="clt">
            <div className="profile">
              <img src={client2} alt="" />
              <div className="name">
                <h3>James Mcavoy</h3>
                <div className="job">Marketer</div>
              </div>
            </div>
            <div className="feedback">
              At Grovo Grocery Store, you can get fresh fruits and vegetables.
              And it is not only about fruits or vegetables, you can buy all
              kinds of stuff here.
            </div>
          </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Client;
