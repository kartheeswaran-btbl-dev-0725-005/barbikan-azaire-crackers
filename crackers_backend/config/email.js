const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: false,
	auth: {
		user: process.env.BREVO_USER,
		pass: process.env.SMTP_PASS,
	},
});

module.exports = transporter;
