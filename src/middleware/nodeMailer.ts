import nodeMailer from 'nodemailer';

// Create a test account for transporter
const transporter = nodeMailer.createTransport({
    host: "smtp.ethereal.email", // Replace with your SMTP host
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "giles.hills28@ethereal.email",
        pass: "jU2GNeUHbZvhgGjwUG",
  },
});

// callback fn

// transporter.verify((success, error) => {
//     if (error) {
//         console.error("Error verifying transporter:", error);
//     } else {
//         console.log("Transporter is ready to send emails");
//     }
// });


(async () => {
    const info = await transporter.sendMail({
        from: '"Giles Hills 👻" <giles.hills28@ethereal.email>',
        to: "mokolijose@gmail.com",
        subject: "Hello ✔",
        text: "Hello world",
        html: "<b>Hello world</b>",
    });

    console.log("Message sent:", info.messageId);
})();