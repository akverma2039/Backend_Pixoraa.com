require("dotenv").config(); // Load environment variables

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({ origin: "https://pixoraa.netlify.app/" }));

app.use(bodyParser.json());

app.post("/contact", async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail
                pass: process.env.EMAIL_PASS, // Your Gmail App Password
            },
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: "akverma2039@gmail.com", // Your receiving email
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Email sending failed:", error);
        res.status(500).json({ message: "Email sending failed", error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
