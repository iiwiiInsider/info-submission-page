import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

interface MandateEmailParams {
  to: string;
  fullName: string;
  mandateId: string;
}

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

async function getTransporter() {
  if (transporter) return transporter;
  // Prefer explicit env credentials
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    return transporter;
  }
  // Auto create test account for dev if none provided
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  if (process.env.NODE_ENV !== 'production') {
    console.log('Created Ethereal test SMTP account for dev:', testAccount.user);
  }
  return transporter;
}

export async function sendMandateEmail({ to, fullName, mandateId }: MandateEmailParams) {
  const subject = `Congrats on signing Mandate ${mandateId}!`;
  const text = `Hello ${fullName},\n\nCongratulations on signing Mandate ${mandateId}. Please contact the agency for further information regarding next steps.\n\nWarm regards,\nMandate Team`;
  const html = `<p>Hello ${fullName},</p><p>Congratulations on signing <strong>Mandate ${mandateId}</strong>. Please contact the agency for further information regarding next steps.</p><p>Warm regards,<br/>Mandate Team</p>`;
  try {
    const tx = await getTransporter();
    const info = await tx.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      to,
      subject,
      text,
      html
    });
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email sent preview URL (if using Ethereal):');
      console.log((nodemailer as any).getTestMessageUrl?.(info));
    }
    return { ok: true, info };
  } catch (err) {
    console.error('Email send failed (non-fatal):', err);
    return { ok: false, error: (err as Error).message };
  }
}
