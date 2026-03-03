import nodemailer from 'nodemailer';

const config = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(config);

export const sendEmail = async (data) => {
    const email = {
        ...data,
        from: `Podorozhnyky <${process.env.SMTP_FROM}>`
    };
    await transporter.sendMail(email);
    return true;
};