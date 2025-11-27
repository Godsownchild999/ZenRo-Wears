import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./AdminDashboard.css";
// Adjust the import below to match where you export your Firestore instance.
import { db } from "../firebase/config";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  Timestamp,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

function AdminDashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });
  const [stockForm, setStockForm] = useState({
    productId: "",
    stock: "",
  });
  const [messageForm, setMessageForm] = useState({
    customerName: "",
    body: "",
  });
  const [actionStatus, setActionStatus] = useState("");

  useEffect(() => {
    let unsubscribeOrders = () => {};
    let unsubscribeInventory = () => {};
    let unsubscribeMessages = () => {};

    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const todayTimestamp = Timestamp.fromDate(startOfToday);

      const ordersRef = collection(db, "orders");
      const ordersQuery = query(
        ordersRef,
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const todaysOrdersQuery = query(
        ordersRef,
        where("createdAt", ">=", todayTimestamp)
      );

      unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        setOrders(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      });

      unsubscribeInventory = onSnapshot(
        collection(db, "inventory"),
        (snapshot) => {
          setInventory(
            snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }))
          );
        }
      );

      unsubscribeMessages = onSnapshot(
        query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(5)),
        (snapshot) => {
          setMessages(
            snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }))
          );
        }
      );

      // Prime today stats once so derived metrics can use it immediately.
      onSnapshot(todaysOrdersQuery, (snapshot) => {
        setTodayOrders(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      });
    } catch (err) {
      console.error("Admin dashboard listeners failed:", err);
      setError("Could not load store analytics. Please refresh.");
    } finally {
      setLoading(false);
    }

    return () => {
      unsubscribeOrders();
      unsubscribeInventory();
      unsubscribeMessages();
    };
  }, []);

  const [todayOrders, setTodayOrders] = useState([]);

  const metrics = useMemo(() => {
    const todayCount = todayOrders.length;

    const todayRevenue = todayOrders.reduce((sum, order) => {
      const total = Number(order.total) || 0;
      return sum + total;
    }, 0);

    const lowStockCount = inventory.filter((item) => {
      const qty = Number(item.stock ?? item.quantity ?? 0);
      return qty > 0 && qty <= 5;
    }).length;

    return {
      todayCount,
      todayRevenue,
      lowStockCount,
    };
  }, [todayOrders, inventory]);

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, "inventory"), {
        name: productForm.name.trim(),
        price: Number(productForm.price) || 0,
        stock: Number(productForm.stock) || 0,
        category: productForm.category.trim(),
        createdBy: user?.email ?? "admin",
        createdAt: serverTimestamp(),
      });
      setActionStatus("Product created.");
      setShowCreateProduct(false);
      setProductForm({ name: "", price: "", stock: "", category: "" });
    } catch (err) {
      setActionStatus(`Failed to create product: ${err.message}`);
    }
  };

  const handleAdjustStock = async (event) => {
    event.preventDefault();
    try {
      await updateDoc(doc(db, "inventory", stockForm.productId.trim()), {
        stock: Number(stockForm.stock) || 0,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email ?? "admin",
      });
      setActionStatus("Inventory updated.");
      setShowAdjustStock(false);
      setStockForm({ productId: "", stock: "" });
    } catch (err) {
      setActionStatus(`Failed to update stock: ${err.message}`);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        customerName: messageForm.customerName.trim(),
        body: messageForm.body.trim(),
        channel: "admin-dashboard",
        createdAt: serverTimestamp(),
        createdBy: user?.email ?? "admin",
      });
      setActionStatus("Message queued for customer.");
      setShowMessageModal(false);
      setMessageForm({ customerName: "", body: "" });
    } catch (err) {
      setActionStatus(`Failed to send message: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <section className="admin-page">
        <p className="muted">Loading dashboard…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-page">
        <p className="text-danger">{error}</p>
      </section>
    );
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <button type="button" className="active">Overview</button>
          <button type="button">Orders</button>
          <button type="button">Products</button>
          <button type="button">Customers</button>
        </nav>
      </aside>

      <main className="admin-content">
        <section className="admin-cards">
          <article>
            <span>Today’s sales</span>
            <strong>₦0</strong>
          </article>
          <article>
            <span>Pending orders</span>
            <strong>0</strong>
          </article>
          <article>
            <span>Active customers</span>
            <strong>0</strong>
          </article>
        </section>

        <div className="admin-placeholder">
          Hook up Firestore queries to populate charts, lists, and management tools here.
        </div>

        <section className="admin-card">
          <h2>Pending fulfilment</h2>
          <p className="muted">
            Orders update in real-time from your Firestore collection.
          </p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted text-center">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerName ?? "Unknown"}</td>
                    <td>{order.items?.length ?? 0}</td>
                    <td>₦{Number(order.total || 0).toLocaleString("en-NG")}</td>
                    <td>
                      <span className={`badge status-${order.status ?? "pending"}`}>
                        {order.status ?? "pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="admin-card">
          <h2>Latest customer messages</h2>
          <ul className="messages">
            {messages.length === 0 ? (
              <li className="muted">No messages yet.</li>
            ) : (
              messages.map((message) => (
                <li key={message.id}>
                  <strong>{message.customerName ?? "Customer"}</strong>
                  <span className="muted">
                    —{" "}
                    {message.createdAt?.toDate
                      ? message.createdAt.toDate().toLocaleString()
                      : "just now"}
                  </span>
                  <p>{message.body ?? "No message body provided."}</p>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="admin-card">
          <h2>Store activity</h2>
          <ul className="activity-feed">
            {todayOrders.length === 0 ? (
              <li className="muted">No activity yet today.</li>
            ) : (
              todayOrders.map((order) => (
                <li key={order.id}>
                  <span className="timestamp">
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleString()
                      : "just now"}
                  </span>
                  <span className="activity">
                    New order{" "}
                    <strong>#{order.id}</strong> from{" "}
                    <strong>{order.customerName ?? "Unknown"}</strong>
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="admin-card">
          <h2>Metrics</h2>
          <ul className="metrics-list">
            <li>
              <span className="metric">{metrics.todayCount}</span>
              <span className="label">New orders</span>
            </li>
            <li>
              <span className="metric">
                ₦{metrics.todayRevenue.toLocaleString("en-NG")}
              </span>
              <span className="label">Revenue</span>
            </li>
            <li>
              <span className="metric">{metrics.lowStockCount}</span>
              <span className="label">Low stock alerts</span>
            </li>
          </ul>
        </section>

        <div className="admin-actions">
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => setShowCreateProduct(true)}
          >
            Create product
          </button>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => setShowAdjustStock(true)}
          >
            Update inventory
          </button>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => setShowMessageModal(true)}
          >
            Message customer
          </button>
        </div>

        {actionStatus && (
          <div className="admin-toast" role="status">
            {actionStatus}
          </div>
        )}

        {showCreateProduct && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <form className="admin-modal__panel" onSubmit={handleCreateProduct}>
              <header>
                <h3>Create product</h3>
                <button
                  type="button"
                  className="admin-modal__close"
                  onClick={() => setShowCreateProduct(false)}
                >
                  ×
                </button>
              </header>
              <label>
                Name
                <input
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </label>
              <label>
                Price (₦)
                <input
                  type="number"
                  min="0"
                  value={productForm.price}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, price: event.target.value }))
                  }
                  required
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, stock: event.target.value }))
                  }
                  required
                />
              </label>
              <label>
                Category
                <input
                  value={productForm.category}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                />
              </label>
              <footer>
                <button type="submit" className="btn btn-dark">
                  Save product
                </button>
              </footer>
            </form>
          </div>
        )}

        {showAdjustStock && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <form className="admin-modal__panel" onSubmit={handleAdjustStock}>
              <header>
                <h3>Adjust stock</h3>
                <button
                  type="button"
                  className="admin-modal__close"
                  onClick={() => setShowAdjustStock(false)}
                >
                  ×
                </button>
              </header>
              <label>
                Product ID
                <input
                  value={stockForm.productId}
                  onChange={(event) =>
                    setStockForm((prev) => ({ ...prev, productId: event.target.value }))
                  }
                  required
                />
              </label>
              <label>
                New stock level
                <input
                  type="number"
                  min="0"
                  value={stockForm.stock}
                  onChange={(event) =>
                    setStockForm((prev) => ({ ...prev, stock: event.target.value }))
                  }
                  required
                />
              </label>
              <footer>
                <button type="submit" className="btn btn-dark">
                  Update stock
                </button>
              </footer>
            </form>
          </div>
        )}

        {showMessageModal && (
          <div className="admin-modal" role="dialog" aria-modal="true">
            <form className="admin-modal__panel" onSubmit={handleSendMessage}>
              <header>
                <h3>Message customer</h3>
                <button
                  type="button"
                  className="admin-modal__close"
                  onClick={() => setShowMessageModal(false)}
                >
                  ×
                </button>
              </header>
              <label>
                Customer name
                <input
                  value={messageForm.customerName}
                  onChange={(event) =>
                    setMessageForm((prev) => ({
                      ...prev,
                      customerName: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label>
                Message
                <textarea
                  rows={4}
                  value={messageForm.body}
                  onChange={(event) =>
                    setMessageForm((prev) => ({ ...prev, body: event.target.value }))
                  }
                  required
                />
              </label>
              <footer>
                <button type="submit" className="btn btn-dark">
                  Send
                </button>
              </footer>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

AdminDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default AdminDashboard;