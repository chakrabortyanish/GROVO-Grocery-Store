import Footer from "../../components/footer/Footer";
import "./ContactUs.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="contact-page">

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-overlay">
          <h1>Get In Touch</h1>
          <p>
            Have questions, suggestions, or need assistance?
            We're always ready to help.
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
          <h2>
            We'd Love To Hear From You
          </h2>

          <p>
            Whether you have a question about orders, deliveries,
            partnerships, or feedback, our team is ready to assist you.
          </p>

          <div className="contact-highlight">
            <h4>⚡ Fast Support</h4>
            <p>
              Most customer queries are resolved within 24 hours.
            </p>
          </div>

          <div className="contact-highlight">
            <h4>🚚 Delivery Support</h4>
            <p>
              Need help tracking your grocery order? We're here.
            </p>
          </div>

          <div className="contact-highlight">
            <h4>💚 Customer First</h4>
            <p>
              Your satisfaction is our highest priority.
            </p>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form">

            <div className="input-group">
              <input
                type="text"
                placeholder="Your Name"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Subject"
                required
              />
            </div>

            <div className="input-group">
              <textarea
                rows="6"
                placeholder="Write your message..."
                required
              />
            </div>

            <button type="submit">
              Send Message
            </button>

          </form>
        </div>

      </section>

      {/* CTA */}
      <section className="contact-cta">
        <h2>Need Groceries Delivered Today?</h2>
        <p>
          Shop thousands of fresh products and daily essentials.
        </p>

        <button onClick={()=> window.location.href= "/"}>Start Shopping</button>
      </section>
    
    <Footer/>
    </div>
  );
};

export default ContactUs;