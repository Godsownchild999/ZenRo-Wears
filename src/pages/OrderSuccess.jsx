import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const total = state?.total ?? 0;

  useEffect(() => {
    if (!state) {
      navigate("/shop", { replace: true });
    }
  }, [state, navigate]);

  return (
    <div className="order-success page-fade-in">
      <div className="card">
        <div className="icon">✅</div>
        <h1>Order confirmed</h1>
        <p>
          Thank you for shopping with ZenRo. We’ve sent a confirmation email with your order
          details and tracking instructions.
        </p>

        <div className="summary">
          <p>
            <span>Order total</span>
            <strong>₦{Number(total || 0).toLocaleString()}</strong>
          </p>
          <p>
            <span>Status</span>
            <strong>Processing</strong>
          </p>
        </div>

        <div className="actions">
          <Link to="/shop" className="btn btn-outline-dark">
            Continue shopping
          </Link>
          <Link to="/myorders" className="btn btn-dark">
            Track orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;