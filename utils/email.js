const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Defined the email options
  const mailOptions = {
    from: 'Uriel Bengaev <hello@uriel.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) sent the email with nodemailer

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
