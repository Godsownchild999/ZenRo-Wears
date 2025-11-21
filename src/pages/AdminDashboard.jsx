import "./AdminDashboard.css";

function AdminDashboard() {
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
      </main>
    </div>
  );
}

export default AdminDashboard;