import React, { useState } from "react";
import Footer from "../../components/footer/Footer";
import "./ContactUs.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    orderId: "", // Optional field according to your schema
  });

  const [loading, setLoading] = useState(false);
  const userToken = localStorage.getItem("token");

  // Dynamically update state when any input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Handler triggered by form submission
  const handleContact = async (e) => {
    e.preventDefault(); // Prevents page reload
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      });

      
        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
        }

        // Reset form inputs back to clear states
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: "",
          orderId: "",
        });
      }
     catch (error) {
      console.error("Form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay">
          <h1>Get In Touch</h1>
          <p>
            Have questions, suggestions, or need assistance? We're always ready
            to help.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="contact-info">
        <div className="info-card">
          <FaPhoneAlt />
          <h3>Call Us</h3>
          <p>+91 98765 43210</p>
        </div>

        <div className="info-card">
          <FaEnvelope />
          <h3>Email Us</h3>
          <p>support@grovo.com</p>
        </div>

        <div className="info-card">
          <FaMapMarkerAlt />
          <h3>Visit Us</h3>
          <p>Kolkata, West Bengal, India</p>
        </div>

        <div className="info-card">
          <FaClock />
          <h3>Working Hours</h3>
          <p>8:00 AM - 10:00 PM</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-container">
        <div className="contact-left">
          <span>CONTACT GROVO</span>
          <h2>We'd Love To Hear From You</h2>

          <p>
            Whether you have a question about orders, deliveries, partnerships,
            or feedback, our team is ready to assist you.
          </p>

          <div className="contact-highlight">
            <h4>⚡ Fast Support</h4>
            <p>Most customer queries are resolved within 24 hours.</p>
          </div>

          <div className="contact-highlight">
            <h4>🚚 Delivery Support</h4>
            <p>Need help tracking your grocery order? We're here.</p>
          </div>

          <div className="contact-highlight">
            <h4>💚 Customer First</h4>
            <p>Your satisfaction is our highest priority.</p>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleContact}>
            <div className="input-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
              />
            </div>

            {/* Optional field included to allow order reference attachment */}
            <div className="input-group">
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                placeholder="Order ID Reference (Optional)"
              />
            </div>

            <div className="input-group">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Order Issue">Order Issue</option>
                <option value="Delivery">Delivery</option>
                <option value="Payment">Payment</option>
                <option value="Refund">Refund</option>
                <option value="Account">Account</option>
                <option value="Technical">Technical</option>
                <option value="Suggestion">Suggestion</option>
              </select>
            </div>

            <div className="input-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Write your message..."
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="contact-cta">
        <h2>Need Groceries Delivered Today?</h2>
        <p>Shop thousands of fresh products and daily essentials.</p>

        <button onClick={() => (window.location.href = "/")}>
          Start Shopping
        </button>
      </section>

      <Footer />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ContactUs;
