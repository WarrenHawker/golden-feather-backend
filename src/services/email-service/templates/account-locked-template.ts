const accountLockedTemplate = (name: string, url: string) => {
  const text = `
    Hello ${name},

    Your account has been locked due to to suspicious activity on the account.

    To get your account unlocked, please go to the below link to reset your password.
    ${url} 
    
    If you have any concerns please reach out to the team. 

    Regards
    Golden Feather Team
  `;

  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Locked</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #f8bb44;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
        }
        .content {
            padding: 20px;
            color: #333333;
        }
        .content p {
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background-color: #f8bb44;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
        }
        .footer {
            padding: 10px;
            text-align: center;
            color: #777777;
            font-size: 12px;
            border-top: 1px solid #dddddd;
            margin-top: 20px;
        }
    </style>
</head>
<body>

<div class="email-container">
    <div class="header">
        <h1>Account Locked</h1>
    </div>

    <div class="content">
        <p>Hello <strong>${name}</strong>,</p>

        <p>Your account has been locked due to suspicious activity.</p>

        <p>To unlock your account, please click the button below to reset your password:</p>

        <p style="text-align: center;">
            <a href="${url}" class="button">Reset Password</a>
        </p>

        <p>If you have any concerns, please feel free to reach out to our support team.</p>

        <p>Best Regards,<br>Golden Feather Team</p>
    </div>

    <div class="footer">
        <p>If you did not attempt to access your account, please disregard this email or contact support.</p>
    </div>
</div>

</body>
</html>
  `;

  return { text, html };
};

export default accountLockedTemplate;
