import { useEffect, useState } from "react";
// import WhiteTee from "../assets/white-tee.png";
import PropTypes from "prop-types";
import "./ProductQuickView.css";

function ProductQuickView({ product, onClose, addToCart }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("front");

  const placeholderImage = "";

  const chooseImage = (...candidates) => {
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
    return null;
  };

  useEffect(() => {
    // Defensive: ensure sizes is a non-empty array
    if (!Array.isArray(product.sizes) || product.sizes.length === 0) {
      setSelectedSize("");
    } else {
      setSelectedSize(product.sizes[0] ?? "");
    }
    setQuantity(1);
    setActiveImage("front");
  }, [product]);

  const imageForView = (view) =>
    chooseImage(
      product.images?.[view],
      view === "front" ? product.image : null,
      product.imageUrl,
      product.frontImageUrl,
      product.frontImage,
      product.image
    ) || "";

  const handleImageError = (event) => {
    // If no fallback, just hide the image
    event.target.style.display = "none";
  };

  const handleSubmit = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    addToCart({
      ...product,
      size: selectedSize,
      quantity,
      image: imageForView("front"),
    });
    onClose();
  };

  if (!Array.isArray(product.sizes) || product.sizes.length === 0) {
    return (
      <div className="quick-view-overlay" role="dialog" aria-modal="true">
        <div className="quick-view-modal">
          <button className="close-btn" type="button" onClick={onClose} aria-label="Close quick view">
            ×
          </button>
          <div className="quick-view-content">
            <div className="quick-view-details">
              <h2>{product.name}</h2>
              <p style={{ color: '#c00', fontWeight: 600 }}>
                This product is missing sizes.<br />
                Please edit it in the admin dashboard and add at least one size.
              </p>
              <button type="button" className="add-to-cart-btn disabled" disabled>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quick-view-overlay" role="dialog" aria-modal="true">
      <div className="quick-view-modal">
        <button className="close-btn" type="button" onClick={onClose} aria-label="Close quick view">
          ×
        </button>

        <div className="quick-view-content">
          <div className="quick-view-gallery">
            <div className="main-image">
              <img
                src={imageForView(activeImage)}
                alt={`${product.name} ${activeImage}`}
                onError={handleImageError}
              />
            </div>

            <div className="thumbnail-row">
              {["front", "back"].map((view) => (
                <button
                  key={view}
                  type="button"
                  className={`thumb ${activeImage === view ? "active" : ""}`}
                  onClick={() => setActiveImage(view)}
                  disabled={
                    !chooseImage(
                      product.images?.[view],
                      product.image,
                      product.imageUrl,
                      product.frontImageUrl,
                      product.frontImage
                    )
                  }
                >
                  <img
                    src={imageForView(view)}
                    alt={`${view} view`}
                    onError={handleImageError}
                  />
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
      front: PropTypes.string,
      back: PropTypes.string,
    }),
    image: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default ProductQuickView;