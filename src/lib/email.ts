import nodemailer from "nodemailer";

export const sendEMail = async (email: string, message: string) => {
  const transporter = nodemailer.createTransport({
    host: "mxe9ce.netcup.net",
    port: 465,
    secure: true,
    auth: {
      user: "info@villaya.de",
      pass: "30092008!Villaya",
    },
  });

  await transporter.verify();

  await transporter.sendMail({
    from: "info@villaya.de",
    to: email,
    subject: `Neue Nachricht'`,
    text: message,
    replyTo: email,
  });
};
