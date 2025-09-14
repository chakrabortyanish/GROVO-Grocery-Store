import React from 'react'
import "./Partner.css"

import {logo1,
logo2,
logo3,
logo4,
tata,
accenture_logo,
adobe_logo,
infosys,
samsung_logo} from "../../assets/index.js"

import Marquee from "react-fast-marquee";

const logos = [logo1, logo2, logo3, logo4,
  tata,
accenture_logo,
adobe_logo,
infosys,
samsung_logo,
]

const Partner = () => {
  return (
    <div className='trusted-partner'>
      <h1 className="title">Our Trusted Partner</h1>
        <div className="logo-slider">
          <Marquee  pauseOnHover={false} speed={60} gradient={false} >
             {
               logos.map((item, index)=>{
                return (<img src={item} alt="" />)
               })
             }
          </Marquee>
        </div>
    </div>
  )
}

export default Partner
