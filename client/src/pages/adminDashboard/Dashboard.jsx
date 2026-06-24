import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const adminUsername = localStorage.getItem("adminUsername")

  const stats = {
    products: 125,
    orders: 58,
    categories: 6,
    revenue: 25600,
  };

  return (
    <div className="dashboard">
      <div className="welcome">
        <h1>Welcome Back, <i>{adminUsername}</i></h1>
        <p>Manage your grocery store efficiently.</p>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Products</h3>
          <h2>{stats.products}</h2>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <h2>{stats.orders}</h2>
        </div>

        <div className="card">
          <h3>Categories</h3>
          <h2>{stats.categories}</h2>
        </div>

        <div className="card">
          <h3>Revenue</h3>
          <h2>₹{stats.revenue}</h2>
        </div>
      </div>

      <div className="quick-actions">
        <div
          className="action-card"
          onClick={() =>
            navigate("/admin/add-product")
          }
        >
          <h3>➕ Add Product</h3>
        </div>

        <div
          className="action-card"
          onClick={() =>
            navigate("/admin/manage-products")
          }
        >
          <h3>📦 Manage Products</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;