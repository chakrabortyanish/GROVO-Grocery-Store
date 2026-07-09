import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import {
  SignUp,
  LogIn,
  Cart,
  Delete,
  AboutUs,
  ContactUs,

  // Product category pages
  BabyCare,
  Medicine,
  Stationary,
  Beauty,
  Gardening,
  FruitsVegetables,
} from "./pages/index.js";
import Feedback from "./pages/feedback/Feedback.jsx";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { CartProvider } from "./components/contextAPI/cartContext.jsx";

import Payment from "./pages/checkout/Payment.jsx";
import Orders from "./pages/orders/Orders.jsx";

//admin pages
import AdminAuth from "./pages/adminAuth/AdminAuth.jsx";

import AdminLayout from "./pages/adminDashboard/AdminLayout.jsx";
import AddProduct from "./pages/adminDashboard/AddProduct.jsx";
import ManageProducts from "./pages/adminDashboard/ManageProducts.jsx";
import Dashboard from "./pages/adminDashboard/Dashboard.jsx";

import VerifyOTP from "./pages/VerifyOTP/VerifyOTP.jsx"

// Router setup
const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/login" element={<LogIn />}></Route>
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/delete" element={<Delete />}></Route>
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/payment" element={<Payment />}></Route>
      <Route path="/orders" element={<Orders />}></Route>
      <Route path="/about" element={<AboutUs />}></Route>
      <Route path="/contact" element={<ContactUs />}></Route>
      <Route path="/feedback" element={<Feedback />}></Route>
      // Product category routes
      <Route path="/baby-care" element={<BabyCare />} />
      <Route path="/medicine" element={<Medicine />} />
      <Route path="/stationary" element={<Stationary />} />
      <Route path="/beauty" element={<Beauty />} />
      <Route path="/gardening" element={<Gardening />} />
      <Route path="/fruits-vegetables" element={<FruitsVegetables />} />
      {/* admin routes */}
      <Route path="/admin-auth" element={<AdminAuth />}></Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="manage-products" element={<ManageProducts />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <CartProvider>
    <RouterProvider router={Router} />
  </CartProvider>,
);
