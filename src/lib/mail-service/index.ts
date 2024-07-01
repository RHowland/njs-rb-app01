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

  // const mailReactHtmlString: string = ReactDOMServer.renderToStaticMarkup(mailReactHtml);
  return mailReactHtml;
} 