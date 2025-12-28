import PropTypes from "prop-types";
import "./Cart.css";
import { Link } from "react-router-dom";

const formatCurrency = (amount) => amount.toLocaleString("en-NG", {
  style: "currency",
  currency: "NGN",
});

function Cart({ cart, removeFromCart }) {
  // Calculate total price safely
  const totalPrice = cart.reduce((sum, item) => {
    // Ensure price exists and is a number
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  if (!cart.length) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              {/* Safe price formatting */}
              <p>Price: {formatCurrency(item.price)}</p>
            </div>
            <button
              onClick={() => removeFromCart(item)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>Total: {formatCurrency(totalPrice)}</h3>
        <Link to="/checkout" className="btn btn-dark rounded-pill px-4 mt-3 checkout-btn">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

Cart.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      quantity: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      size: PropTypes.string,
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
};

export default Cart;