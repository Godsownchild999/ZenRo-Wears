import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Checkout.css";

function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    deliveryNote: "",
    paymentMethod: "card",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [errors, setErrors] = useState({});
  const [validationModal, setValidationModal] = useState({
    open: false,
    missing: [],
  });

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

  const sanitizeValue = (name, value) => {
    switch (name) {
      case "fullName":
        return value
          .replace(/[^a-zA-Z\s'.-]/g, "")
          .replace(/\s+/g, " ")
          .trimStart()
          .slice(0, 60);
      case "email":
        return value.replace(/\s/g, "").slice(0, 80);
      case "phone":
        return value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "").slice(0, 16);
      case "addressLine1":
      case "addressLine2":
        return value
          .replace(/[^a-zA-Z0-9\s,#.-]/g, "")
          .replace(/\s+/g, " ")
          .trimStart()
          .slice(0, 120);
      case "city":
      case "state":
        return value
          .replace(/[^a-zA-Z\s'.-]/g, "")
          .replace(/\s+/g, " ")
          .trimStart()
          .slice(0, 50);
      case "postalCode":
        return value.replace(/\D/g, "").slice(0, 10);
      case "deliveryNote":
        return value.slice(0, 220);
      default:
        return value;
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: sanitizeValue(name, value),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (validationModal.open) {
      setValidationModal({ open: false, missing: [] });
    }
  };

  const handlePaymentMethodChange = (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, paymentMethod: value }));
    setErrors((prev) => ({ ...prev, paymentMethod: "" }));
    if (validationModal.open) {
      setValidationModal({ open: false, missing: [] });
    }
  };

  const formFields = useMemo(
    () => [
      {
        label: "Full name",
        name: "fullName",
        placeholder: "Jane Doe",
        autoComplete: "name",
        required: true,
        maxLength: 60,
      },
      {
        label: "Email",
        name: "email",
        placeholder: "you@example.com",
        type: "email",
        autoComplete: "email",
        required: true,
        maxLength: 80,
      },
      {
        label: "Phone number",
        name: "phone",
        placeholder: "+2348000000000",
        inputMode: "tel",
        autoComplete: "tel",
        required: true,
        maxLength: 16,
        pattern: "\\+?[0-9]{7,15}",
        title: "Enter 7–15 digits, optionally starting with +",
      },
      {
        label: "Address line 1",
        name: "addressLine1",
        placeholder: "123 Zen Street, Apartment 4",
        autoComplete: "address-line1",
        required: true,
        maxLength: 120,
      },
      {
        label: "Address line 2",
        name: "addressLine2",
        placeholder: "Suite, unit, landmark (optional)",
        autoComplete: "address-line2",
        required: false,
        maxLength: 120,
      },
      {
        label: "City",
        name: "city",
        placeholder: "Lekki",
        autoComplete: "address-level2",
        required: true,
        maxLength: 50,
      },
      {
        label: "State/Region",
        name: "state",
        placeholder: "Lagos",
        autoComplete: "address-level1",
        required: true,
        maxLength: 50,
      },
      {
        label: "Postal code",
        name: "postalCode",
        placeholder: "101245",
        inputMode: "numeric",
        autoComplete: "postal-code",
        required: true,
        maxLength: 10,
        pattern: "\\d{4,10}",
        title: "Enter digits only",
      },
    ],
    []
  );

  const paymentOptions = [
    { label: "Card (Paystack/Flutterwave)", value: "card" },
    { label: "Bank transfer", value: "transfer" },
    { label: "Cash on delivery", value: "cod" },
  ];

  const validate = useCallback(() => {
    const nextErrors = {};
    const missingLabels = [];

    const addMissing = (label) => {
      if (!missingLabels.includes(label)) {
        missingLabels.push(label);
      }
    };

    formFields.forEach(({ name, label, required }) => {
      const value = (form[name] || "").trim();
      if (required && !value) {
        nextErrors[name] = "Required";
        addMissing(label);
      }
    });

    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        nextErrors.email = "Enter a valid email address";
        addMissing("Email");
      }
    }

    if (form.phone.trim() && !/^\+?\d{7,15}$/.test(form.phone)) {
      nextErrors.phone = "Enter a valid phone number";
      addMissing("Phone number");
    }

    if (form.postalCode.trim() && !/^\d{4,10}$/.test(form.postalCode.trim())) {
      nextErrors.postalCode = "Enter a valid postal code";
      addMissing("Postal code");
    }

    if (!form.paymentMethod) {
      nextErrors.paymentMethod = "Select a payment option";
      addMissing("Payment method");
    }

    setErrors(nextErrors);

    if (missingLabels.length) {
      setValidationModal({ open: true, missing: missingLabels });
      return false;
    }

    setValidationModal({ open: false, missing: [] });
    return true;
  }, [form, formFields]);

  const orderSummary = useMemo(
    () =>
      cart.map((item) => {
        const price = Number(item.price) || 0;
        const quantity = item.quantity || 0;
        return {
          id: item.id,
          name: item.name,
          size: item.size,
          quantity,
          price,
          lineTotal: price * quantity,
        };
      }),
    [cart]
  );

  const handleCheckout = useCallback(
    async (event) => {
      event?.preventDefault();
      if (!cart.length || isSubmitting) return;

      if (!validate()) {
        return;
      }

      setCheckoutError("");
      setIsSubmitting(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const summarySnapshot = orderSummary.map((item) => ({ ...item }));
        const totalAmount = summarySnapshot.reduce(
          (sum, item) => sum + item.lineTotal,
          0
        );

        const fallbackOrderId =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `ZENRO-${Date.now()}`;

        const response = null; // replace with real gateway response when integrated
        const createdOrderId = response?.id ?? fallbackOrderId;

        navigate("/order-success", {
          state: {
            total: totalAmount,
            items: summarySnapshot,
            orderId: createdOrderId,
          },
        });

        await clearCart();
      } catch (error) {
        console.error("Checkout failed:", error);
        setCheckoutError("We couldn’t finalise your order. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [cart.length, isSubmitting, validate, orderSummary, navigate, clearCart]
  );

  return (
    <div className="checkout-page container py-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleCheckout} noValidate>
          <section>
            <h3>Shipping details</h3>
            <div className="form-grid">
              {formFields.map(
                ({
                  label,
                  name,
                  type = "text",
                  placeholder,
                  autoComplete,
                  required,
                  maxLength,
                  inputMode,
                  pattern,
                  title,
                }) => (
                  <label key={name} className="form-field">
                    <span className="label-title">
                      {label}
                      {required && <span className="required-indicator">*</span>}
                    </span>
                    <input
                      name={name}
                      type={type}
                      value={form[name]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      autoComplete={autoComplete}
                      maxLength={maxLength}
                      inputMode={inputMode}
                      pattern={pattern}
                      title={title}
                      aria-invalid={Boolean(errors[name])}
                    />
                    {errors[name] && <small className="error-text">{errors[name]}</small>}
                  </label>
                )
              )}
            </div>
          </section>

          <section>
            <h3>Order notes (optional)</h3>
            <label className="field-label">
              <span className="label-title">Delivery note</span>
              <textarea
                name="deliveryNote"
                rows="3"
                placeholder="Gate code, landmark, delivery instructions"
                value={form.deliveryNote}
                onChange={handleInputChange}
                maxLength={220}
              ></textarea>
            </label>
          </section>

          <section>
            <h3>Payment method</h3>
            <div className="payment-options">
              {paymentOptions.map(({ label, value }) => (
                <label key={value} className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={form.paymentMethod === value}
                    onChange={handlePaymentMethodChange}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            {errors.paymentMethod && (
              <small className="error-text">{errors.paymentMethod}</small>
            )}
          </section>

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={!cart.length || isSubmitting}
          >
            {isSubmitting ? "Processing…" : "Place order"}
          </button>
          {checkoutError && <p className="text-danger mt-3">{checkoutError}</p>}
        </form>

        <aside className="order-summary">
          <h3>Order summary</h3>

          <ul className="summary-items">
            {cart.map((item) => (
              <li key={`${item.id}-${item.size || "default"}`} className="summary-item">
                <img src={item.image || item.images?.front} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <small>
                    Size: {item.size || "N/A"} • Qty: {item.quantity || 1}
                  </small>
                </div>
                <span>
                  ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </span>
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

      {validationModal.open && (
        <div className="form-modal-backdrop" role="alertdialog" aria-modal="true">
          <div className="form-modal">
            <h2>Checkout incomplete</h2>
            <p>Please fill the fields below:</p>
            <ul className="form-modal-list">
              {validationModal.missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className="form-modal-btn"
              onClick={() => setValidationModal({ open: false, missing: [] })}
            >
              Review form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Checkout.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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