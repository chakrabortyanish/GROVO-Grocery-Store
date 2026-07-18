import Contact from "../models/contact.model.js";
import {User} from "../models/User.js";
import Order from "../models/order.model.js";
import sendMail from "../utils/sendMail.js";


// ==============================
// Customer Create Contact
// ==============================

export const createContact = async (req, res) => {
  try {

    const {
      orderId,
      name,
      email,
      subject,
      category,
      message,
    } = req.body;

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
        <h2>Grovo Support</h2>

        <p>Hello <b>${contact.name}</b>,</p>

        <p>${reply}</p>

        <br/>

        <p>Thank you for contacting Grovo.</p>

        <p><b>Grovo Support Team</b></p>
    `;

    await sendMail(
      contact.email,
      "Reply from Grovo Support",
      html
    );

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