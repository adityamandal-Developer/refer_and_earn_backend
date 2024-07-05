const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: process.env.NM_USER,
                pass: process.env.NM_PASS,
            },
        });
    }

    async sendReferralCodeEmail(email, name, referralCode) {
        const mailOptions = {
            from: process.env.NM_USER,
            to: email,
            subject: "Your Referral Code",
            text: `Dear ${name},\n\nThank you for becoming a referrer. Your unique referral code is: ${referralCode}\n\nBest regards,\nThe Referral Team`
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ', info.messageId);
            return info;
        } catch (error) {
            console.error("Error sending email: ", error);
            throw error;
        }
    }
}

module.exports = new EmailService();