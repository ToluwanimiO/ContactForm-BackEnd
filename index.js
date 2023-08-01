const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: false, // Ignore self-signed certificates
    },
});
app.post("/send", (req, res) => {
    console.log(req.body);
    const mail = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: req.body.name,
        text: `${req.body.name} ${req.body.email} \n${req.body.message}`,
    };
    console.log(mail)
    transporter.sendMail(mail)
        .then((response) => {
            console.log(response);
            res.status(200).send("Form has been successfully submitted!");
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send("Something went wrong.");
        })
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});