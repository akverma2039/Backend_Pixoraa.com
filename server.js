require("dotenv").config(); // Load environment variables

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Allow CORS for frontend (adjust as needed)
app.use(cors()); // Temporary: Allow all origins
app.use(cors({ origin: "https://pixoraa.netlify.app/" })); // Use this in production

app.use(bodyParser.json());

app.post("/contact", async (req, res) => {
    const { name, email, phone, message } = req.body;
    console.log("Received data:", req.body);

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing EMAIL_USER or EMAIL_PASS in .env file");
        return res.status(500).json({ message: "Email configuration error" });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail
                pass: process.env.EMAIL_PASS, // Your Gmail App Password
            },
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: "info.pixoraa@gmail.com", // Your receiving email
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email sending failed:", error.response || error);
        res.status(500).json({ message: "Email sending failed", error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
