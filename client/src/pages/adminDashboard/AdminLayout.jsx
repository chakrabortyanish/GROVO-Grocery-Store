import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Admin.css";

import { MdLogout } from "react-icons/md";

import { toast, ToastContainer } from "react-toastify";

const AdminLayout = () => {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem("adminUsername");

   if(!adminUsername){
    toast.info("Login First");
    setTimeout(() => {
        navigate("/admin-auth");
      }, 1500);
   }


  const logout = ()=>{
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    toast.success("Logout Successfull");
    setTimeout(() => {
        navigate("/");
      }, 1500);
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>Grovo Admin</h2>

        <nav>
          <NavLink to="/admin/dashboard" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/add-product">
            Add Product
          </NavLink>

          <NavLink to="/admin/manage-products">
            Manage Products
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
      <ToastContainer/>
    </div>
  );
};

export default AdminLayout;