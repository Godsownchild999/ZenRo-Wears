import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./AdminDashboard.css";
// Adjust the import below to match where you export your Firestore instance.
import { db, auth } from "../firebase/config";
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
  deleteDoc,
} from "firebase/firestore";
import { Navigate } from "react-router-dom";

const productFormInitial = {
  name: "",
  price: "",
  category: "",
  description: "",
  status: "available",
  sizes: "",
  frontImageUrl: "",
  backImageUrl: "",
};

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "coming-soon", label: "Coming soon" },
  { value: "out-of-stock", label: "Out of stock" },
];

function AdminDashboard({ user }) {
    const [orderSearch, setOrderSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [productForm, setProductForm] = useState(productFormInitial);
  const [stockForm, setStockForm] = useState({
    productId: "",
    stock: "",
    status: "available",
  });
  const [messageForm, setMessageForm] = useState({
    customerName: "",
    body: "",
  });
  const [actionStatus, setActionStatus] = useState("");
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    let unsubscribeOrders = () => {};
    let unsubscribeInventory = () => {};
    let unsubscribeMessages = () => {};
    let unsubscribeTodayOrders = () => {};
    let unsubscribeCustomers = () => {};

    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const todayTimestamp = Timestamp.fromDate(startOfToday);

      const ordersRef = collection(db, "orders");
      const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"));
      const todaysOrdersQuery = query(ordersRef, where("createdAt", ">=", todayTimestamp));

      unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        setOrders(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      });

      unsubscribeInventory = onSnapshot(collection(db, "products"), (snapshot) => {
        setInventory(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      });

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
      unsubscribeTodayOrders = onSnapshot(todaysOrdersQuery, (snapshot) => {
        setTodayOrders(
          snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      });

      unsubscribeCustomers = onSnapshot(collection(db, "customers"), (snapshot) => {
        setCustomers(
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
      unsubscribeTodayOrders();
      unsubscribeCustomers();
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

  const openProductModal = (product = null) => {
    if (product) {
      setProductForm({
        name: product.name ?? "",
        price:
          product.price !== undefined && product.price !== null
            ? String(product.price)
            : "",
        category: product.category ?? "",
        description: product.description ?? "",
        status: product.status ?? "available",
        sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
        frontImageUrl: product.images?.front ?? product.image ?? "",
        backImageUrl: product.images?.back ?? "",
      });
      setEditingProductId(product.id);
    } else {
      setProductForm(productFormInitial);
      setEditingProductId(null);
    }

    setShowCreateProduct(true);
  };

  const closeProductModal = () => {
    setShowCreateProduct(false);
    setEditingProductId(null);
    setProductForm(productFormInitial);
  };

  const handleSaveProduct = async (event) => {
    event.preventDefault();
    try {
      // Always save sizes as an array
      let parsedSizes = productForm.sizes;
      if (typeof parsedSizes === "string") {
        parsedSizes = parsedSizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean);
      }
      if (!Array.isArray(parsedSizes)) parsedSizes = [];

      // Always use a valid default if admin leaves blank
      let frontImage = productForm.frontImageUrl.trim();
      // If the admin left it blank, leave it blank (no forced fallback)
      // This allows the UI to show a true 'no image' state
      const backImage = productForm.backImageUrl.trim();

      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        category: productForm.category,
        price: Number(productForm.price) || 0,
        status: productForm.status,
        sizes: parsedSizes,
        images: {
          front: frontImage,
          back: backImage,
        },
        image: frontImage,
        frontImageUrl: frontImage,
      };

      if (!backImage) {
        delete payload.images.back;
      }

      if (editingProductId) {
        await updateDoc(doc(db, "products", editingProductId), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        setActionStatus("Product updated.");
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setActionStatus("Product created.");
      }

      closeProductModal();
    } catch (err) {
      setActionStatus(`Failed to save product: ${err.message}`);
    }
  };

  const handleAdjustStock = async (event) => {
    event.preventDefault();
    try {
      await updateDoc(doc(db, "products", stockForm.productId.trim()), {
        stock: Number(stockForm.stock) || 0,
        status: stockForm.status,
        updatedAt: serverTimestamp(),
      });
      setActionStatus("Inventory updated.");
      setShowAdjustStock(false);
      setStockForm({ productId: "", stock: "", status: "available" });
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

  const handleDeleteProduct = async (productId) => {
    if (!productId) return;
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this product? This cannot be undone.");
      if (!confirmed) return;
    }

    try {
      await deleteDoc(doc(db, "products", productId));
      setActionStatus("Product deleted.");
      if (editingProductId === productId) {
        closeProductModal();
      }
    } catch (err) {
      setActionStatus(`Failed to delete product: ${err.message}`);
    }
  };

  const handleChangeProductStatus = async (productId, status) => {
    try {
      await updateDoc(doc(db, "products", productId), {
        status,
        updatedAt: serverTimestamp(),
      });
      setActionStatus("Product status updated.");
    } catch (err) {
      setActionStatus(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!orderId) return;
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Delete this order record? This cannot be undone.");
      if (!confirmed) return;
    }

    try {
      await deleteDoc(doc(db, "orders", orderId));
      setActionStatus("Order deleted.");
    } catch (err) {
      setActionStatus(`Failed to delete order: ${err.message}`);
    }
  };

  const [access, setAccess] = useState({ loading: true, admin: false });

  useEffect(() => {
    let isActive = true;

    const checkClaims = async () => {
      const firebaseUser =
        typeof user?.getIdTokenResult === "function" ? user : auth.currentUser;

      if (!firebaseUser) {
        if (isActive) setAccess({ loading: false, admin: false });
        return;
      }

      const token = await firebaseUser.getIdTokenResult(true);
      if (isActive) {
        setAccess({
          loading: false,
          admin: Boolean(token.claims?.admin),
        });
      }
    };

    checkClaims();

    return () => {
      isActive = false;
    };
  }, [user]);

  const handleProductFieldChange = ({ target: { name, value } }) => {
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value) => `₦${Number(value ?? 0).toLocaleString("en-NG")}`;

  const formatDate = (value) => {
    if (!value) return "—";
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleString();
    }
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    if (typeof value === "string") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleString();
      }
    }
    return "—";
  };

  const derivedCustomers = useMemo(() => {
    const byCustomer = new Map();
    orders.forEach((order) => {
      const email = order.customerEmail ?? order.email ?? "";
      const key = email || order.customerName || order.id;
      const existing = byCustomer.get(key) ?? {
        id: key,
        name: order.customerName ?? "Unknown",
        email: email || "—",
        phone: order.customerPhone ?? order.phone ?? "—",
        totalOrders: 0,
        totalSpend: 0,
        lastOrder: null,
      };

      existing.totalOrders += 1;
      existing.totalSpend += Number(order.total) || 0;

      const placedAt = order.createdAt?.toDate?.() ?? null;
      if (placedAt && (!existing.lastOrder || placedAt > existing.lastOrder)) {
        existing.lastOrder = placedAt;
      }

      byCustomer.set(key, existing);
    });

    return Array.from(byCustomer.values());
  }, [orders]);

  const customerRows = useMemo(() => {
    if (customers.length) {
      return customers.map((record) => ({
        id: record.id,
        name: record.name ?? record.displayName ?? "Unknown",
        email: record.email ?? record.contactEmail ?? "—",
        phone: record.phone ?? record.phoneNumber ?? "—",
        totalOrders: record.totalOrders ?? record.orders?.length ?? 0,
        totalSpend: Number(record.totalSpend ?? record.lifetimeValue ?? 0),
        lastOrder: record.lastOrder ?? record.lastOrderAt ?? record.updatedAt ?? null,
      }));
    }

    return derivedCustomers;
  }, [customers, derivedCustomers]);

  const renderOverview = () => (
    <>
      <section className="admin-cards">
        <article>
          <span>Today’s sales</span>
          <strong>{formatCurrency(metrics.todayRevenue)}</strong>
        </article>
        <article>
          <span>New orders today</span>
          <strong>{metrics.todayCount}</strong>
        </article>
        <article>
          <span>Low stock products</span>
          <strong>{metrics.lowStockCount}</strong>
        </article>
      </section>

      <div className="admin-placeholder">
        Hook up Firestore queries to populate charts, lists, and management tools here.
      </div>

      <section className="admin-card">
        <div className="admin-card__header">
          <h2>Pending fulfilment</h2>
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => setShowMessageModal(true)}
          >
            Message customer
          </button>
        </div>
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
              orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName ?? "Unknown"}</td>
                  <td>{order.items?.length ?? 0}</td>
                  <td>{formatCurrency(order.total)}</td>
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
                <span className="muted">— {formatDate(message.createdAt)}</span>
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
                <span className="timestamp">{formatDate(order.createdAt)}</span>
                <span className="activity">
                  New order <strong>#{order.id}</strong> from <strong>{order.customerName ?? "Unknown"}</strong>
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );

  const renderOrders = () => (
    <section className="admin-card">
      <div className="admin-card__header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <h2>Orders</h2>
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
          <input
            type="text"
            placeholder="Search by order ref..."
            value={orderSearch}
            onChange={e => setOrderSearch(e.target.value)}
            style={{padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc', minWidth: 180}}
          />
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => setShowMessageModal(true)}
          >
            Message customer
          </button>
        </div>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Placed</th>
            <th aria-label="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(orders.length === 0 ? [null] : orders)
            .filter(order => !orderSearch || (order && order.id && order.id.toLowerCase().includes(orderSearch.toLowerCase())))
            .map(order => order ? (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customerName ?? "Unknown"}</td>
                <td>{order.items?.length ?? 0}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>
                  <span className={`badge status-${order.status ?? "pending"}`}>
                    {order.status ?? "pending"}
                  </span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <button
                    type="button"
                    className="link-button link-button--danger"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={7} className="muted text-center">
                  No orders yet.
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );

  const renderProducts = () => (
    <>
      <div className="admin-actions">
        <button type="button" className="btn btn-dark" onClick={() => openProductModal()}>
          Create product
        </button>
        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={() => setShowAdjustStock(true)}
        >
          Update inventory
        </button>
      </div>

      <section className="admin-card">
        <h2>Product catalog</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Status</th>
              <th aria-label="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted text-center">
                  No products in Firestore yet.
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.name ?? "Untitled"}</td>
                  <td>{item.category ?? "—"}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{Array.isArray(item.sizes) ? item.sizes.join(", ") : "—"}</td>
                  <td>
                    <select
                      className="admin-table__status"
                      value={item.status ?? "available"}
                      onChange={(event) => handleChangeProductStatus(item.id, event.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => openProductModal(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link-button link-button--danger"
                      onClick={() => handleDeleteProduct(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );

  const renderCustomers = () => {
    const sorted = [...customerRows].sort((a, b) => b.totalOrders - a.totalOrders);

    return (
      <section className="admin-card">
        <h2>Customers</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Lifetime spend</th>
              <th>Last order</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted text-center">
                  No customers yet.
                </td>
              </tr>
            ) : (
              sorted.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.totalOrders}</td>
                  <td>{formatCurrency(customer.totalSpend)}</td>
                  <td>{formatDate(customer.lastOrder)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return renderOrders();
      case "products":
        return renderProducts();
      case "customers":
        return renderCustomers();
      default:
        return renderOverview();
    }
  };

  if (access.loading) {
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

  if (!access.admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <button
            type="button"
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            type="button"
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            type="button"
            className={activeTab === "customers" ? "active" : ""}
            onClick={() => setActiveTab("customers")}
          >
            Customers
          </button>
        </nav>
      </aside>

      <main className="admin-content">{renderTabContent()}</main>

      {actionStatus && (
        <div className="admin-toast" role="status">
          {actionStatus}
        </div>
      )}

      {showCreateProduct && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <form className="admin-modal__panel" onSubmit={handleSaveProduct}>
            <header>
              <h3>{editingProductId ? "Edit product" : "Create product"}</h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={closeProductModal}
              >
                ×
              </button>
            </header>
              <label className="admin-field">
                Name
                <input
                  name="name"
                  value={productForm.name}
                  onChange={handleProductFieldChange}
                  required
                />
              </label>
              <label className="admin-field">
                Price (₦)
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={productForm.price}
                  onChange={handleProductFieldChange}
                  required
                />
              </label>
              <label className="admin-field">
                Category
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleProductFieldChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Trousers">Trousers</option>
                  <option value="Joggers">Joggers</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Sportswear">Sportswear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </label>
              <label className="admin-field">
                Description
                <textarea
                  name="description"
                  rows={3}
                  value={productForm.description}
                  onChange={handleProductFieldChange}
                  required
                />
              </label>
              <label className="admin-field">
                Status
                <select
                  name="status"
                  value={productForm.status}
                  onChange={handleProductFieldChange}
                  required
                >
                  <option value="available">Available</option>
                  <option value="coming-soon">Coming soon</option>
                  <option value="out-of-stock">Out of stock</option>
                </select>
              </label>
              <label className="admin-field">
                Sizes (comma separated)
                <input
                  name="sizes"
                  value={productForm.sizes}
                  onChange={handleProductFieldChange}
                  placeholder="e.g. XS,S,M,L,XL"
                />
              </label>
              <label className="admin-field">
                Front image URL
                <input
                  name="frontImageUrl"
                  value={productForm.frontImageUrl}
                  onChange={handleProductFieldChange}
                  placeholder="https://..."
                  required
                />
              </label>
              <label className="admin-field">
                Back image URL (optional)
                <input
                  name="backImageUrl"
                  value={productForm.backImageUrl}
                  onChange={handleProductFieldChange}
                  placeholder="https://..."
                />
              </label>
              <footer>
                <button type="submit" className="btn btn-dark">
                  {editingProductId ? "Update product" : "Save product"}
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
              <label>
                Status
                <select
                  value={stockForm.status}
                  onChange={(event) =>
                    setStockForm((prev) => ({ ...prev, status: event.target.value }))
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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