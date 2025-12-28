import PropTypes from "prop-types";

function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="quickview-modal">
      <div className="quickview-content">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <button
          type="button"
          className="btn btn-dark quickview-cta"
          onClick={handleAdd}
        >
          Add to cart
        </button>
        <button type="button" className="btn btn-light" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

QuickViewModal.propTypes = {
  product: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default QuickViewModal;