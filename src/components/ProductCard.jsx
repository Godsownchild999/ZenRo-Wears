import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./ProductCard.css";


function ProductCard({ product, onSelect }) {
  const { images, name, price, status, category, initial, selling, image, available, comingSoon, addToCart } = product;
  const navigate = useNavigate();


  const renderStatusTag = () => {
    if (status === "out-of-stock") {
      return <span className="product-tag tag-out">Out of stock</span>;
    }
    if (status === "coming-soon") {
      return <span className="product-tag tag-soon">Coming soon</span>;
    }
    return null;
  };

  const priceDisplay = (
    <p>
      <del>{initial ? initial.toLocaleString("en-NG", { style: "currency", currency: "NGN" }) : ""}</del> &nbsp;
      <span>{selling ? selling.toLocaleString("en-NG", { style: "currency", currency: "NGN" }) : ""}</span>
    </p>
  );
   const handleClick = () => {
    if (comingSoon) {
      navigate("/coming-soon");
    } else if (available && typeof addToCart === "function") addToCart({ name, selling,image });
   };

  return (
    <div
      className={`product-card ${!available ? "out-of-stock" : ""} ${comingSoon ? "coming-soon" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelect();
        }
      }}
    >
      <div className="product-image">
        <img src={images.front} alt={name} loading="lazy" />
        {renderStatusTag()}
      </div>

      <div className="product-body">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name || "Product Name"}</h3>
        <p className="product-price">₦{Number(price || 0).toLocaleString()}</p>
        {priceDisplay}
      </div>

      <div className="product-hover">
        <button
          className="view-details-btn"
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onSelect();
          }}
        >
          Quick view
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    images: PropTypes.shape({
      front: PropTypes.string.isRequired,
      back: PropTypes.string,
    }).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    status: PropTypes.oneOf(["available", "coming-soon", "out-of-stock"]).isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProductCard;