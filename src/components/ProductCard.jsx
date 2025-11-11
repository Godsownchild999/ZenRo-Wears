import { Navigate, useNavigate } from "react-router-dom";
// import "./ProductCard.css";


function ProductCard({ name, desc, initial, selling, image, available, comingSoon, addToCart }) {
  const navigate = useNavigate();


    
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
      onClick={() => {
        if (comingSoon) window.location.href = "/coming-soon";
      }}
    >
      <div className="product-image">
        <img src={image} alt={name} />
        {!available && <div className="overlay">Out of Stock</div>}
        {comingSoon && <div className="overlay">Coming Soon</div>}
      </div>

      <h3>{name || "Product Name"}</h3>
      <p>{desc || "Product description coming soon."}</p>
      {priceDisplay}

      {!comingSoon && available && <button onClick={handleClick}>Add to Cart</button>}
    </div>
  );
}

export default ProductCard;