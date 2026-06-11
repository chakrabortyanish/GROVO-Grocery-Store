import Footer from "../../components/footer/Footer";
import "./Feedback.css";
import { FaStar, FaSmile, FaHeart } from "react-icons/fa";

const Feedback = () => {
  return (
    <div className="feedback-page">

      {/* Hero Section */}
      <section className="feedback-hero">
        <div className="feedback-hero-content">
          <span>CUSTOMER FEEDBACK</span>
          <h1>Your Opinion Matters</h1>
          <p>
            Help us improve your grocery shopping experience.
            Every suggestion, review, and rating helps us serve you better.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="feedback-stats">
        <div className="stat-card">
          <h2>10K+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="stat-card">
          <h2>4.9★</h2>
          <p>Average Rating</p>
        </div>

        <div className="stat-card">
          <h2>98%</h2>
          <p>Satisfaction Rate</p>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-container">

        {/* Left */}
        <div className="feedback-left">
          <span>WHY FEEDBACK?</span>

          <h2>
            Your Voice Helps Us Grow
          </h2>

          <p>
            We continuously improve our delivery service,
            product quality, and shopping experience based on
            valuable customer feedback.
          </p>

          <div className="benefit-card">
            <FaSmile />
            <div>
              <h4>Better Experience</h4>
              <p>Your feedback shapes future improvements.</p>
            </div>
          </div>

          <div className="benefit-card">
            <FaHeart />
            <div>
              <h4>Customer First</h4>
              <p>We prioritize customer satisfaction above all.</p>
            </div>
          </div>

        </div>

        {/* Right */}
        <div className="feedback-form-wrapper">

          <form className="feedback-form">

            <h3>Share Your Experience</h3>

            <input
              type="text"
              placeholder="Your Name"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              required
            />

            {/* Rating */}
            <div className="rating-section">
              <p>Rate Your Experience</p>

              <div className="stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            </div>

            <textarea
              rows="6"
              placeholder="Tell us what you liked or how we can improve..."
              required
            />

            <button type="submit">
              Submit Feedback
            </button>

          </form>

        </div>

      </section>

      {/* Testimonials */}
      <section className="testimonial-section">

        <h2>What Customers Say</h2>

        <div className="testimonial-grid">

          <div className="testimonial-card">
            <p>
              "Fresh products, quick delivery and excellent service.
              Highly recommended!"
            </p>

            <h4>Sarah M.</h4>
          </div>

          <div className="testimonial-card">
            <p>
              "Grovo saves me a lot of time every week.
              Amazing experience."
            </p>

            <h4>David R.</h4>
          </div>

          <div className="testimonial-card">
            <p>
              "Easy ordering process and great customer support."
            </p>

            <h4>Emma K.</h4>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="feedback-cta">
        <h2>Thank You For Helping Us Improve</h2>
        <p>
          Together we're creating a better grocery shopping experience.
        </p>
      </section>

    <Footer/>
    </div>
  );
};

export default Feedback;