const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Contact Form Route
router.post("/contact", async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL, // Your Gmail
            pass: process.env.PASSWORD, // Your App Password (Not your Gmail password)
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.RECIPIENT_EMAIL, // Your email where you want to receive messages
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending message" });
    }
});

module.exports = router;
