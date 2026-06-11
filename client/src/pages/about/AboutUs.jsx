import Footer from "../../components/footer/Footer";
import "./AboutUs.css";
import { FaTruck, FaLeaf, FaUsers, FaShoppingBasket } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <span>ABOUT GROVO</span>
          <h1>
            Fresh Groceries <br />
            Delivered To Your Doorstep
          </h1>
          <p>
            At Grovo, we make grocery shopping faster, smarter, and more
            convenient. From fresh vegetables to daily essentials, everything
            you need is just a few clicks away.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-image">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e"
            alt="Groceries"
          />
        </div>

        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            We believe everyone deserves access to fresh, high-quality groceries
            without spending hours shopping. Our mission is to simplify daily
            life through reliable delivery, affordable pricing, and exceptional
            customer service.
          </p>

          <div className="mission-stats">
            <div>
              <h3>10K+</h3>
              <span>Happy Customers</span>
            </div>

            <div>
              <h3>5K+</h3>
              <span>Products Available</span>
            </div>

            <div>
              <h3>99%</h3>
              <span>Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>Why Choose Grovo?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <FaTruck />
            <h3>Fast Delivery</h3>
            <p>
              Get groceries delivered to your home quickly and safely.
            </p>
          </div>

          <div className="feature-card">
            <FaLeaf />
            <h3>Fresh Products</h3>
            <p>
              We source fresh fruits, vegetables, and quality products daily.
            </p>
          </div>

          <div className="feature-card">
            <FaUsers />
            <h3>Trusted Service</h3>
            <p>
              Thousands of customers rely on us for their everyday needs.
            </p>
          </div>

          <div className="feature-card">
            <FaShoppingBasket />
            <h3>Wide Selection</h3>
            <p>
              Explore thousands of grocery items from trusted brands.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-content">
          <h2>Our Story</h2>
          <p>
            Grovo was created with a simple goal: making grocery shopping
            effortless. We noticed how busy lifestyles make it difficult for
            people to find time for shopping. That's why we built a platform
            that combines convenience, quality, and affordability into one
            seamless experience.
          </p>

          <p>
            Today, Grovo serves thousands of families, helping them save time
            while enjoying fresh groceries delivered directly to their homes.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Join Thousands Of Happy Customers</h2>
        <p>
          Experience the future of grocery shopping with Grovo.
        </p>

        <button onClick={()=> window.location.href= "/"}>Start Shopping</button>
      </section>

    <Footer/>
    </div>
  );
};

export default AboutUs;