import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdEmail,
  MdFolder,
  MdAccessTime,
  MdAssignmentInd,
  MdShoppingBag,
} from "react-icons/md";
import "./ContactDetailsPage.css";

export default function ContactDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [contact, setContact] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Match this base path setup exactly to your backend route wrapper
  const BACKEND_API = `${import.meta.env.VITE_BACKEND_URL}/api/contact`;

  useEffect(() => {
    fetchContactDetails();
  }, [id]);

  const fetchContactDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_API}/admin/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setContact(data.contact);
        if (data.contact.adminReply) {
          setReplyText(data.contact.adminReply);
        }
      }
    } catch (error) {
      console.error("Error loading contact record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim())
      return alert("Please type a message before replying.");

    try {
      setSubmitting(true);
      const response = await fetch(`${BACKEND_API}/admin/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText }),
      });
      const data = await response.json();

      if (data.success) {
        alert("Reply has been sent successfully to your email address.");
        fetchContactDetails(); // Refresh view
      }
    } catch (error) {
      console.error("Error submitting response reply:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="details-loading">Loading request details...</div>;
  if (!contact)
    return (
      <div className="details-error">Contact record request not found.</div>
    );

  return (
    <div className="details-container">
      {/* Back button link mapping to core dashboard layout layout */}
      <button
        className="btn-back"
        onClick={() => navigate("/admin/manage-contacts")}
      >
        <MdArrowBack /> Back to Requests
      </button>

      <div className="details-grid">
        {/* Left Side Column: Core Message Details */}
        <div className="details-main-card">
          <div className="ticket-header">
            <span className="ticket-id-tag">
              ID-{id.slice(-6).toUpperCase()}
            </span>
            <span
              className={`status-pill status-${contact.status.toLowerCase().replace(" ", "")}`}
            >
              {contact.status}
            </span>
          </div>

          <h2 className="ticket-subject">{contact.subject}</h2>

          <div className="meta-info-row">
            <div className="meta-item">
              <MdFolder /> <span>{contact.category}</span>
            </div>
            <div className="meta-item">
              <MdAccessTime />{" "}
              <span>{new Date(contact.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <hr className="divider" />

          <div className="message-body-box">
            <h4>Customer Message:</h4>
            <p className="message-content">{contact.message}</p>
          </div>
        </div>

        {/* Right Side Column: User & Link Metadata Profile */}
        <div className="details-sidebar-card">
          <h3>Customer Context</h3>

          <div className="context-item">
            <MdAssignmentInd className="context-icon" />
            <div>
              <label>Submitted Name</label>
              <p>{contact.name}</p>
            </div>
          </div>

          <div className="context-item">
            <MdEmail className="context-icon" />
            <div>
              <label>Email Address</label>
              <p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            </div>
          </div>

          {contact.orderId && (
            <div className="context-item order-highlight">
              <MdShoppingBag className="context-icon" />
              <div>
                <label>Related Order Reference ID</label>
                <p>#{contact.orderId._id || contact.orderId}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Area: Action Admin Reply Email Form */}
      <div className="reply-section-card">
        <h3>
          {contact.repliedAt ? "Update Mail Reply" : "Compose Mail Response"}
        </h3>
        {contact.repliedAt && (
          <p className="reply-timestamp">
            Last replied on: {new Date(contact.repliedAt).toLocaleString()}
          </p>
        )}

        <form onSubmit={handleSendReply}>
          <textarea
            className="reply-textarea"
            placeholder="Type your formal customer resolution reply text here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={6}
          />
          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit-reply"
              disabled={submitting}
            >
              {submitting
                ? "Sending Dispatch Mail..."
                : "Send Official Response"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
