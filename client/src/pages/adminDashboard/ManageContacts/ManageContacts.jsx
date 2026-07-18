import React, { useState, useEffect } from "react";
import { MdSupportAgent, MdVisibility, MdDelete, MdReply } from "react-icons/md";
import "./ManageContacts.css";

// Assuming you have an API utility layer or axios setup instance
// Replace with your actual API calling logic
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/contact`; 

export default function ManageContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  // Fetch all contact submissions on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      // Replace with your authenticated fetch/axios configuration
      const response = await fetch(`${API_URL}/admin`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        
      });
      const data = await response.json();
      if (data.success) {
        console.log(data.contacts)
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler to update support ticket status directly from dropdown
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",  Authorization: `Bearer ${token}`, },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        // Update local state smoothly
        setContacts((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Helper function to return dynamic color classes based on the status
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending"; // Light orange/yellow
      case "In Progress":
        return "status-progress"; // Light blue
      case "Resolved":
        return "status-resolved"; // Light green
      case "Closed":
        return "status-closed"; // Light gray
      default:
        return "";
    }
  };

  return (
    <div className="manage-container">
      {/* Header Block matching the provided UI layout */}
      <div className="page-header">
        <div className="header-icon-box">
          <MdSupportAgent className="header-icon" />
        </div>
        <div className="header-text-box">
          <h2>Manage Support Requests</h2>
          <p>Monitor, reply, and update customer support submissions dynamically.</p>
        </div>
      </div>

      {/* Main Content Table Card */}
      <div className="table-card">
        {loading ? (
          <div className="loading-state">Loading customer requests...</div>
        ) : (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr className="table-head-col">
                  <th>USER ID</th>
                  <th>CUSTOMER</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th className="text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">No contact requests found.</td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact._id}>
                      {/* Sub-ID Pill Badge Box */}
                      <td>
                        <span className="id-badge">
                          #{contact._id.slice(-6).toUpperCase()}
                        </span>
                      </td>

                      {/* User Info Details */}
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">
                            {contact.name || (contact.userId?.name) || "Guest User"}
                          </span>
                          <span className="customer-email">
                            {contact.email || (contact.userId?.email)}
                          </span>
                        </div>
                      </td>

                      {/* Category Type */}
                      <td>
                        <span className="category-text">{contact.category}</span>
                      </td>

                      {/* Subject & Message Content Preview snippet */}
                      {/* <td>
                        <div className="message-preview-box">
                          <strong className="subject-line">{contact.subject}</strong>
                          <p className="message-snippet">{contact.message}</p>
                        </div>
                      </td> */}

                      {/* Interactive Status Selector Dropdown */}
                      <td>
                        <select
                          className={`status-select ${getStatusClass(contact.status)}`}
                          value={contact.status}
                          onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Action Triggers matching UI button designs */}
                      <td>
                        <div className="action-buttons-group">
                          <button 
                            className="btn-action btn-view"
                            onClick={() => window.location.href = `/admin/contacts/${contact._id}`}
                            title="View Details"
                          >
                            <MdVisibility /> View 
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                 
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}