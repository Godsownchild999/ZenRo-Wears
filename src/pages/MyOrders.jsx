import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase";
import "./MyOrders.css";

function formatCurrency(value) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

function formatDate(value) {
  if (!value) return "—";
  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString();
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleString();
    }
  }
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  return "—";
}

function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const localFallback = useMemo(() => {
    try {
      const raw = localStorage.getItem("zenro:orders");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (storageError) {
      console.warn("Failed to read cached orders:", storageError);
      return [];
    }
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setOrders(localFallback);
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = collection(db, "orders");
    const ordersQuery = query(
      ref,
      where("customerId", "==", user.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setOrders(docs.length ? docs : localFallback);
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Orders listener failed:", snapshotError);
        setError("We couldn’t load your orders. Showing cached history instead.");
        setOrders(localFallback);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id, localFallback]);

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {error && <p className="orders-error">{error}</p>}

      {loading ? (
        <p className="orders-loading">Loading your orders…</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">You haven’t made any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order.id ?? index} className="order-card">
              <div className="order-card__header">
                <h4>Order #{index + 1}</h4>
                <span className={`status-badge status-${order.status ?? "pending"}`}>
                  {order.status ?? "pending"}
                </span>
              </div>
              <p>
                <strong>Date:</strong> {formatDate(order.createdAt ?? order.date)}
              </p>
              <ul>
                {(order.items ?? []).map((item, itemIndex) => (
                  <li key={`${order.id ?? index}-${itemIndex}`}>
                    {item.name} — {formatCurrency(item.price)} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="total">
                <strong>Total:</strong> {formatCurrency(order.total)}
              </p>
              {order.orderId && (
                <p className="order-reference">
                  <strong>Reference:</strong> {order.orderId}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

MyOrders.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

export default MyOrders;