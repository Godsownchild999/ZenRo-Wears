import React, { useEffect, useState } from "react";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">You haven’t made any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <h4>Order #{index + 1}</h4>
              <p><strong>Date:</strong> {order.date}</p>
              <ul>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} — ₦{item.price.toLocaleString()} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="total">
                <strong>Total:</strong> ₦{order.total.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;