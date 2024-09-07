const passwordResetEmailTemplate = (
  resetUrl: string,
  requestIP: string,
  requestTime: string
) => {
  const text = `Hello,

  We received a request to reset your password for your account. If you made this request, please follow the instructions below to reset your password.
  
  To reset your password, click on the following link or copy and paste it into your browser:
  
  ${resetUrl}
  
  Please note, this link will expire in 1 hour.
  
  If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
  
  Thank you,
  The Golden Feather Team
  
  <p>Security Note: This request was made from IP: ${requestIP} on ${requestTime}. If you suspect any malicious activity, please contact us immediately.</p>`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
          <style>
      /* Global Styles */
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #444;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      a {
        color: #1a73e8;
        text-decoration: none;
        font-weight: bold;
      }
      a:hover {
        text-decoration: underline;
      }
      .footer {
        font-size: 12px;
        color: #888;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password for your account. If you made this request, please follow the instructions below to reset your password.</p>
      <p>
          <a href="${resetUrl}">Click here to reset your password</a><br>
          If the link above doesn't work, copy and paste this URL into your browser:<br>
          ${resetUrl}
      </p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, you can safely ignore this email. Your account will remain secure.</p>
      <p>Thank you,<br>The Golden Feather Team</p>
       <div class="footer">
            <p>Security Note: This request was made from IP: ${requestIP} on ${requestTime}. If you suspect any malicious activity, please contact us immediately.</p>
        </div>
  </body>
  </html>
  `;

  return { text, html };
};

export default passwordResetEmailTemplate;
