import nodemailer from "nodemailer";
import config from "../../../config";

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Pet Adoption 👻" <mostakememon123@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Reset Password Link", // Subject line
    //  text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};

export default emailSender;
