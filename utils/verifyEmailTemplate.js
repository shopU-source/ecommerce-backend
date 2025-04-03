const verifyEmailTemplate = (name, verifyCode) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification - ShopU</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #4caf50;
        margin: 0;
      }
      .content {
        text-align: center;
      }
      .content p {
        font-size: 16px;
        line-height: 1.5;
      }
      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #4caf50;
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        display: inline-block;
        margin: 20px 0;
        letter-spacing: 2px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #777;
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verify Your Email Address</h1>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>
          Thanks for registering with ShopU. Please use the OTP below to verify
          your email address.
        </p>
        <div class="otp">${verifyCode}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 ShopU. All rights reserved.</p>
        <p>Please do not reply to this automated message.</p>
      </div>
    </div>
  </body>
</html>`;
};

export default verifyEmailTemplate;
