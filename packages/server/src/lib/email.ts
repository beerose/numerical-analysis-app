import nodeMailer, { Transporter } from 'nodemailer';

let transporter: Transporter;

export const email = {
  get transporter() {
    if (!transporter) {
      transporter = nodeMailer.createTransport({
        auth: {
          pass: process.env.EMAIL_PASSWORD,
          user: process.env.EMAIL,
        },
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
      });
    }
    return transporter;
  },

  prepareTemplate({ username, link }: { username: string; link: string }) {
    return /* html */ `
    <b>Witaj ${username},</b>
    <br /><br />
    Poniżej znajduje się link, dzięki któremu możesz założyć konto w portalu Analiza Numeryczna M.
    <br />
    <a href="${link}">Dołącz do aplikacji</a>
  `;
  },
};
