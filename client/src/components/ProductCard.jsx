import React from "react";

const ProductCard = ({ item }) => {

  const handleCart = (e) => {
    console.log(e.currentTarget.id);
  }
  
  return (
    <div className="itemInfo">
      <div className="image">
        <img src={item.image} alt={item.name} />
      </div>

      <h3>{item.name}</h3>
      <div className="weight">
        {item.quantity} {item.unit}
      </div>
      <div className="price">Rs. {item.price}</div>

      <button className="add-to-cart" id={item._id} onClick={handleCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
