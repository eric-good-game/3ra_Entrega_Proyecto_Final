import nodemailer from 'nodemailer';
import logger from './logger';

const EMAIL = "diego.jofre@bue.edu.ar";
const PASS_MAIL = "kijfnxfuonlnjoyu";
export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: EMAIL,
        pass: PASS_MAIL
    }
});
let mailOptions = {
    from: EMAIL,
    to: 'Recipient <>',
    subject: 'New user registered',
    text: 'New user data',
    html:''
};
type Content = {
    [key: string]: string | number;
}
async function sendMail(to:string, content:Content) {
    try {
        const translateKey:{[key:string]:string} = {
            full_name: 'Nombre completo',
            email: 'Email',
            password: 'Contraseña',
            age: 'Edad',
            phone_number: 'Teléfono',
            address: 'Dirección',
        }
        Object.keys(translateKey).forEach(key => {
            mailOptions.html += `<p><span style="font-weight:bold">${translateKey[key]}</span>: ${content[key]}</p>`;
        });
        mailOptions.to = `<${to}>`;
      const info = await transporter.sendMail(mailOptions);
      logger.info(JSON.stringify(info));
    } catch (err) {
        logger.error(JSON.stringify(err));
    }
}

export default sendMail;