import { useCallback } from "react";
import WhiteTee from "../assets/white-tee.png";
import PropTypes from "prop-types";
import "./ProductCard.css";

const statusBadge = {
  available: null,
  "coming-soon": { label: "Coming soon", tone: "amber" },
  "out-of-stock": { label: "Out of stock", tone: "scarlet" },
};

const placeholderImage = "";

const chooseImage = (...candidates) => {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return placeholderImage;
};

function ProductCard({ product, onSelect }) {
  const badge = statusBadge[product.status] ?? null;

  // Defensive: ensure sizes is a non-empty array for quick view
  const canQuickView = Array.isArray(product.sizes) && product.sizes.length > 0;

  const handleImageError = useCallback((event) => {
    // If no fallback, just hide the image
    event.target.style.display = "none";
  }, []);

  return (
    <article className={`catalog-card catalog-card--${product.status ?? "available"}`}>
      <button type="button" className="catalog-media" onClick={canQuickView ? onSelect : undefined} aria-label={`View ${product.name}`} disabled={!canQuickView}>
        <img
          src={chooseImage(
            product.images?.front,
            product.image,
            product.imageUrl,
            product.frontImageUrl,
            product.frontImage
          )}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
        />
        {badge && (
          <span className={`catalog-badge catalog-badge--${badge.tone}`}>
            {badge.label}
          </span>
        )}
      </button>

      <div className="catalog-body">
        <p className="catalog-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="catalog-price">
          ₦{Number(product.price || 0).toLocaleString("en-NG")}
        </p>
      </div>

      <div className="catalog-footer">
        <button type="button" className="catalog-quickview" onClick={canQuickView ? onSelect : undefined} disabled={!canQuickView}>
          Quick view
        </button>
      </div>
      {!canQuickView && (
        <div style={{ color: '#c00', fontSize: '0.9em', marginTop: 4 }}>Missing sizes</div>
      )}
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    images: PropTypes.shape({ front: PropTypes.string }),
    image: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProductCard;