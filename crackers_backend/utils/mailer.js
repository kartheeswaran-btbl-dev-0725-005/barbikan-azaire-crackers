const transporter = require('../config/email');

const sendEmail = async ({ to, subject, html }) => {
	try {
		const info = await transporter.sendMail({
			from: process.env.EMAIL_FROM, // "Azaire Crackers <karthees.barbikan@gmail.com>"
			to,
			subject,
			html,
		});

		// console.log(`✅ Email sent: ${info.messageId}`);
		return info;
	} catch (error) {
		// console.error('❌ Email sending failed:', error);
		throw error;
	}
};

module.exports = { sendEmail };
