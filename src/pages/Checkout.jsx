import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout({ cart = [], clearCart }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Order will be saved to localStorage when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();

    const { fullName, address, city, cardNumber, expiry, cvv } = formData;

    if (!fullName || !address || !city || !cardNumber || !expiry || !cvv) {
      setPopupMessage("Please fill out all fields before proceeding.");
      setShowPopup(true);
      return;
    }

    // compute total from cart items
    const total = cart.reduce((sum, item) => {
      const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
      const qty = item.quantity || 1;
      return sum + price * qty;
    }, 0);

    // save order to localStorage
    const order = {
      date: new Date().toLocaleString(),
      items: cart,
      total,
      customer: { fullName, address, city },
    };
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(order);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    clearCart(); // ✅ Clears cart after successful checkout
    navigate("/order-success");
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your delivery address"
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
          />
        </div>

        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="password"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="*"
            />
          </div>
        </div>

        <button type="submit" className="checkout-btn">
          Complete Purchase
        </button>
      </form>

      {/* ✅ Popup Section */}
      {showPopup && (
        <div className="popup-overlay fade-in">
          <div className="popup-box zenro-popup">
            <h3>Incomplete Details</h3>
            <p>{popupMessage}</p>
            <button className="zenro-btn" onClick={() => setShowPopup(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;