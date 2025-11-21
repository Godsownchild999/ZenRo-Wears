import { useState } from "react";
import PropTypes from "prop-types";
import "./ProductQuickView.css";

function ProductQuickView({ product, onClose, addToCart }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("front");

  const handleSubmit = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    addToCart({
      ...product,
      size: selectedSize,
      quantity,
      image: product.images.front,
    });
  };

  return (
    <div className="quick-view-overlay" role="dialog" aria-modal="true">
      <div className="quick-view-modal">
        <button className="close-btn" type="button" onClick={onClose} aria-label="Close quick view">
          ×
        </button>

        <div className="quick-view-content">
          <div className="quick-view-gallery">
            <div className="main-image">
              <img src={product.images[activeImage]} alt={`${product.name} ${activeImage}`} />
            </div>

            <div className="thumbnail-row">
              {["front", "back"].map((view) => (
                <button
                  key={view}
                  type="button"
                  className={`thumb ${activeImage === view ? "active" : ""}`}
                  onClick={() => setActiveImage(view)}
                >
                  <img src={product.images[view]} alt={`${view} view`} />
                  <span>{view}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="quick-view-details">
            <h2>{product.name}</h2>
            <p className="price">₦{product.price.toLocaleString()}</p>
            <p className="description">{product.description}</p>

            <div className="selector-group">
              <label htmlFor="size-select">Select size</label>
              <div id="size-select" className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="selector-group">
              <label htmlFor="quantity-control">Quantity</label>
              <div id="quantity-control" className="quantity-controls">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className={`add-to-cart-btn ${selectedSize ? "" : "disabled"}`}
              onClick={handleSubmit}
              disabled={!selectedSize}
            >
              <i className="fas fa-shopping-cart" aria-hidden="true"></i>
              {selectedSize ? "Add to cart" : "Select size first"}
            </button>

            <div className="product-meta">
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Available sizes:</strong> {product.sizes.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductQuickView.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    category: PropTypes.string.isRequired,
    images: PropTypes.shape({
      front: PropTypes.string.isRequired,
      back: PropTypes.string.isRequired,
    }).isRequired,
    sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default ProductQuickView;