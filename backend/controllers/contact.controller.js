import Contact from "../models/contact.model.js";
import { User } from "../models/User.js";
import Order from "../models/order.model.js";
import sendMail from "../utils/sendMail.js";

// ==============================
// Customer Create Contact
// ==============================

export const createContact = async (req, res) => {
  try {
    const { orderId, name, email, subject, category, message } = req.body;

    if (!name || !email || !subject || !category || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    const userId = req.user.id;

    if (userId) {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
    }

    /* if (orderId) {
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }
    } */

    const contact = await Contact.create({
      userId,
      orderId: orderId || null,
      name,
      email,
      subject,
      category,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your request has been submitted successfully.",
      contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Admin Get All Contacts
// ==============================

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("userId", "name email")
      .populate("orderId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Admin Get Single Contact
// ==============================

export const getSingleContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate("userId")
      .populate("orderId");

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    res.json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Admin Update Status
// ==============================

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    contact.status = status;

    await contact.save();

    res.json({
      success: true,
      message: "Status updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Admin Reply
// ==============================

export const replyToContact = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: "Reply is required.",
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    contact.adminReply = reply;
    // contact.status = "Resolved";
    contact.repliedAt = new Date();

    await contact.save();

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grovo Support Reply</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f6; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Email Wrapper Content Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);">
                
                <!-- Header Banner (Branding) -->
                <tr>
                  <td align="left" style="background-color: #1e293b; padding: 32px 40px;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Grovo Support</h1>
                  </td>
                </tr>
                
                <!-- Main Message Area -->
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #1e293b; font-weight: 500;">
                      Hello <span style="color: #4f46e5; font-weight: 600;">${contact.name}</span>,
                    </p>
                    
                    <!-- Admin Response Block Quote Box -->
                    <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 4px 12px 12px 4px; padding: 24px; margin: 24px 0;">
                      <p style="margin: 0; font-size: 15px; line-height: 26px; color: #334155; white-space: pre-line;">
                        ${reply}
                      </p>
                    </div>
                    
                    <p style="margin: 32px 0 0 0; font-size: 15px; line-height: 24px; color: #64748b;">
                      Thank you for reaching out to us. If you have any further questions regarding this request, simply reply directly to this message.
                    </p>
                  </td>
                </tr>
                
                <!-- Team Sign-off / Signature -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 14px; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Warm regards,</p>
                          <p style="margin: 4px 0 0 0; font-size: 16px; color: #1e293b; font-weight: 600;">Grovo Support Team</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
              
              <!-- Clean Outer Footer Sub-text Block -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin-top: 24px;">
                <tr>
                  <td align="center" style="font-size: 12px; color: #94a3b8; line-height: 18px;">
                    <p style="margin: 0;">This is an automated notification from your ticket request system.</p>
                    <p style="margin: 4px 0 0 0;">&copy; ${new Date().getFullYear()} Grovo Inc. All rights reserved.</p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
      </body>
      </html>
`;

    await sendMail(contact.email, "Reply from Grovo Support", html);

    res.json({
      success: true,
      message: "Reply sent successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Contact
// ==============================

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
