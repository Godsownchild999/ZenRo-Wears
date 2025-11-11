import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <div className="success-page">
      <div className="success-card">
        <h1>🎉 Order Placed Successfully!</h1>
        <p>
          Thank you for shopping with <strong>ZenRo Wears</strong>.<br />
          Your order is being processed and will be delivered to you soon.
        </p>

        <div className="success-actions">
          <Link to="/shop" className="btn">Continue Shopping</Link>
          <Link to="/" className="btn outline">Go Home</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;