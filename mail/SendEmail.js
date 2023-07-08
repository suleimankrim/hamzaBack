import nodemailer from "nodemailer";
import ENV from "../config.js";
import Mailgen from "mailgen";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: ENV.EMAIL,
    pass: ENV.PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});
export const sendMail = (req, res) => {
  const { username, emailName, subject, text } = req.body;
  const email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to innopolis! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  // Generate an HTML email with the provided contents
  let emailBody = mailGenerator.generate(email);
  let message = {
    from: ENV.EMAIL,
    to: emailName,
    subject: subject || "sign up successfully",
    html: emailBody,
  };
  transporter
    .sendMail(message)
    .then(() => {
      res.status(200).send({ message: "you should receive message from as" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
