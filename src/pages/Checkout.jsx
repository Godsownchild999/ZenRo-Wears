import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  notes: "",
  paymentMethod: "card",
};

function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const shipping = subtotal > 0 ? 3500 : 0;
    const tax = subtotal * 0.075;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [cart]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) nextErrors.email = "Invalid email";
    if (!form.phone.trim()) nextErrors.phone = "Required";
    if (!form.address.trim()) nextErrors.address = "Required";
    if (!form.city.trim()) nextErrors.city = "Required";
    if (!form.state.trim()) nextErrors.state = "Required";
    if (!form.postalCode.trim()) nextErrors.postalCode = "Required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await clearCart();
      navigate("/order-success", { state: { total: totals.total } });
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container py-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section>
            <h3>Shipping details</h3>
            <div className="form-grid">
              {[
                { label: "Full name", name: "fullName" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone number", name: "phone", type: "tel" },
                { label: "Address", name: "address" },
                { label: "City", name: "city" },
                { label: "State/Region", name: "state" },
                { label: "Postal code", name: "postalCode" },
              ].map(({ label, name, type = "text" }) => (
                <label key={name} className="form-field">
                  <span>{label}</span>
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    autoComplete="on"
                    required
                  />
                  {errors[name] && <small className="error-text">{errors[name]}</small>}
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3>Order notes (optional)</h3>
            <textarea
              name="notes"
              rows="3"
              placeholder="Delivery instructions..."
              value={form.notes}
              onChange={handleChange}
            ></textarea>
          </section>

          <section>
            <h3>Payment method</h3>
            <div className="payment-options">
              {[
                { label: "Card (Paystack/Flutterwave)", value: "card" },
                { label: "Bank transfer", value: "transfer" },
                { label: "Cash on delivery", value: "cod" },
              ].map(({ label, value }) => (
                <label key={value} className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={form.paymentMethod === value}
                    onChange={handleChange}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>

          <button className="place-order-btn" type="submit" disabled={submitting}>
            {submitting ? "Processing..." : "Place order"}
          </button>
        </form>

        <aside className="order-summary">
          <h3>Order summary</h3>

          <ul className="summary-items">
            {cart.map((item) => (
              <li key={`${item.id}-${item.size}`} className="summary-item">
                <img src={item.image || item.images?.front} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <small>
                    Size: {item.size || "N/A"} • Qty: {item.quantity}
                  </small>
                </div>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>

          <div className="summary-totals">
            <div>
              <span>Subtotal</span>
              <span>₦{totals.subtotal.toLocaleString()}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>₦{totals.shipping.toLocaleString()}</span>
            </div>
            <div>
              <span>Tax (7.5%)</span>
              <span>₦{totals.tax.toFixed(0)}</span>
            </div>
            <div className="summary-grand">
              <span>Total</span>
              <span>₦{totals.total.toLocaleString()}</span>
            </div>
          </div>

          <p className="disclaimer">
            🔒 Payments are secured. You’ll receive an order confirmation email after checkout.
          </p>
        </aside>
      </div>
    </div>
  );
}

Checkout.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      size: PropTypes.string,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      images: PropTypes.object,
    })
  ).isRequired,
  clearCart: PropTypes.func.isRequired,
};

export default Checkout;