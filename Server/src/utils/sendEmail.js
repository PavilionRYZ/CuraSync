const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp, type) => {
  const subject =
    type === "registration"
      ? "Verify Your CuraSync Account"
      : "Reset Your Password - CuraSync";

  const heading =
    type === "registration" ? "Welcome to CuraSync!" : "Password Reset Request";

  const message =
    type === "registration"
      ? "Thank you for registering with CuraSync. Please verify your email address to complete the registration process."
      : "We received a request to reset your password. Use the OTP below to proceed with password reset.";

  const mailOptions = {
    from: `CuraSync Healthcare <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 20px; 
            text-align: center; 
          }
          .header h1 { 
            font-size: 32px; 
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .content { 
            padding: 40px 30px; 
          }
          .content h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 24px;
          }
          .otp-box { 
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 30px; 
            text-align: center; 
            border-radius: 10px;
            margin: 30px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .otp-code { 
            font-size: 36px; 
            font-weight: bold; 
            color: #667eea; 
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
          }
          .info-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer { 
            background: #f8f9fa;
            text-align: center; 
            padding: 30px 20px;
            border-top: 1px solid #e9ecef;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 CuraSync</h1>
            <p>Your Healthcare Partner</p>
          </div>
          <div class="content">
            <h2>${heading}</h2>
            <p>${message}</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Your One-Time Password</p>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="info-box">
              <strong>⚠️ Important:</strong>
              <ul style="margin: 10px 0 0 20px;">
                <li>This OTP is valid for <strong>10 minutes only</strong></li>
                <li>Never share this OTP with anyone</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p><strong>&copy; 2025 CuraSync Healthcare Platform</strong></p>
            <p style="margin-top: 10px; font-size: 12px;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendOTPEmail };
