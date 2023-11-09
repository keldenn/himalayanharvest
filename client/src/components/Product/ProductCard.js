import React from "react";

const ProductCard = ({
  productId,
  imageSrc,
  category,
  rating,
  name,
  farmer,
  price,
  onAddToCart,
}) => {
  return (
    <div className="col-md-4 card" key={productId}>
      <img src={imageSrc} className="card-img-top" alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <div className="card-text">
          <div className="d-flex justify-content-between mb-2">
            <div>{category}</div>
            <div>By {farmer}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div>{rating} stars</div>
            <div>${price}</div>
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={onAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
