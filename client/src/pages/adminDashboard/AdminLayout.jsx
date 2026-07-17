import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css";

import { toast, ToastContainer } from "react-toastify";

import { MdLogout, MdDashboard, MdAddCircle, MdLayers, MdShoppingBag } from 'react-icons/md';

const AdminLayout = () => {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem("adminUsername");

  if (!adminUsername) {
    toast.info("Login First");
    setTimeout(() => {
      navigate("/admin-auth");
    }, 1500);
  }

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    toast.success("Logout Successfull");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>Grovo Admin</h2>

        <nav>
          <NavLink to="/admin/dashboard" end>
            <MdDashboard className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/add-product">
            <MdAddCircle className="nav-icon" />
            <span>Add Product</span>
          </NavLink>

          <NavLink to="/admin/manage-products">
            <MdLayers className="nav-icon" />
            <span>Manage Products</span>
          </NavLink>

          <NavLink to="/admin/manage-orders">
            <MdShoppingBag className="nav-icon" />
            <span>Manage Orders</span>
          </NavLink>
        </nav>

        <div className="logout-admin" onClick={() => logout()}>
          <span>Logout</span>
          <MdLogout />
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
