import React from 'react';

export interface EmailTemplateProps {
  userName: string;
  tokenUrl: string;
  expiresTime: string;
  token : string;
}
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    margin: '20px 0',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#28a745',
    borderRadius: '5px',
    textDecoration: 'none',
  },
  token: {
    display: 'inline-block',
    padding: '10px',
    margin: '10px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#e9ecef',
    borderRadius: '5px',
  },
};


export const emailVerificationTemplate = ({ userName, tokenUrl, expiresTime, token }: EmailTemplateProps): JSX.Element => {

  return (
    <html>
      <body style={styles.container as React.CSSProperties}>
        <h1>Email Verification</h1>
        <p>Hi {userName},</p>
        <p>Thank you for signing up on our platform! Please verify your email address by clicking the link below:</p>
        <a href={tokenUrl} style={styles.button as React.CSSProperties}>Verify Email</a>
        <p>This link will expire in {expiresTime}.</p>
        <p>Your verification token is: <span style={styles.token as React.CSSProperties}>{token}</span></p>
        <p>Thank you,</p>
        <p>The Team</p>
      </body>
    </html>
  );
};


export const passwordResetTemplate = ({ userName, tokenUrl, expiresTime, token }: EmailTemplateProps): JSX.Element => {

  return (
    <html>
      <body style={styles.container as React.CSSProperties}>
        <h1>Password Reset Request</h1>
        <p>Hi {userName},</p>
        <p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
        <a href={tokenUrl} style={styles.button as React.CSSProperties}>Reset Password</a>
        <p>This link will expire in {expiresTime}.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Your password reset token is: <span style={styles.token as React.CSSProperties}>{token}</span></p>
        <p>Thank you,</p>
        <p>The Team</p>
      </body>
    </html>
  );
};


  