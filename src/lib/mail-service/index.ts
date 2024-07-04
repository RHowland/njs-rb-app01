/**
 * ---------------------------------------------------------------------
 * File Name      : mail-service.ts
 * Module Name    : Mail Service
 * Module Type    : Server Module
 * Date Created   : 2024-07-01
 * Dev Initials   : Elias Emon
 * ------------------------------
 * Module Purpose:
 * This module handles sending emails for various purposes such as email verification and password reset. It uses the Resend service for sending emails and React components for generating email content.
 * ------------------------------
 * Functions:
 * - sendMailTask: Sends an email using the Resend service.
 * - generateMailReact: Generates React-based HTML content for emails based on the email type.
 * ------------------------------
 * Input Comments:     (Enter "none" if you have no comments)
 * - sendMailTask: The function accepts an object containing the target email, subject, email content, and email type.
 * - generateMailReact: The function accepts an object containing email type, user name, token URL, expiration time, and token.
 * ------------------------------
 * Output Comments:    (Enter "none" if you have no comments)
 * - sendMailTask: The function returns the response data from the Resend service if the email is successfully sent.
 * - generateMailReact: The function returns a JSX element representing the email content.
 * ------------------------------
 * Additional Comments:
 * - The module uses the Resend service for sending emails.
 * - The email content is generated using React components.
 * Question: Did you have to write any unusual code?
 * Answer  : NO.
 * ------------------------------
 * Section Comments:   (Enter "none" if you have no comments)
 * Function: sendMailTask
 * Description: Sends an email using the Resend service.
 * Input: Object containing the target email, subject, email content, and email type.
 * Output: Response data from the Resend service if the email is successfully sent.
 * ------------------------------
 * Function: generateMailReact
 * Description: Generates React-based HTML content for emails based on the email type.
 * Input: Object containing email type, user name, token URL, expiration time, and token.
 * Output: JSX element representing the email content.
 * ------------------------------
 */

import { MailType } from '@root/src/types';
import { Resend } from 'resend';
import { EmailTemplateProps, emailVerificationTemplate, passwordResetTemplate } from '@/components/email-template';
const resend = new Resend(process.env.RESEND_API_KEY);
const emailDomain = process.env.RESEND_EMAIL_DOMAIN


interface ISendMail {
  targetMail: string;
  subject: string;
  react: string;
  type: MailType
}
export const sendMailTask : any = async ({ targetMail, subject, react, type }: ISendMail) => {
  const { data, error } = await resend.emails.send({
    from: `${type} <noreply@${emailDomain}>`,
    to: [targetMail],
    subject,
    react,
  });
  if (error) {
    throw new Error(error.message);
  }
 
  return data;
}




export interface IgenerateMail extends EmailTemplateProps {
  type: MailType;

}

export const generateMailReact = ({ type, userName, tokenUrl, expiresTime, token }: IgenerateMail) => {
  const mailReactHtml: JSX.Element = type == MailType["resetPass"] ? passwordResetTemplate({ userName, tokenUrl, expiresTime, token }) : emailVerificationTemplate({ userName, tokenUrl, expiresTime, token });


  return mailReactHtml;
} 