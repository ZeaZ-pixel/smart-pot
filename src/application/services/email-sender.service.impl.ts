import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IEmailSenderService } from 'src/domain/services/email-sender.service';

@Injectable()
export class EmailSenderServiceImpl implements IEmailSenderService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as SMTPTransport.Options);

  async send(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Easy Plans <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });
  }
}
