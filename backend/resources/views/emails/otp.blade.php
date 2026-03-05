<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your LetsShop Verification Code</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#eb5310,#ff7a45);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                Lets<span style="color:#ffe0c0;">Shop</span>
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your Verification Code</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#333;font-size:16px;line-height:1.6;">
                Hi there! Use the code below to verify your email address on LetsShop.
              </p>

              <!-- OTP Box -->
              <div
                style="background:#fff8f5;border:2px dashed #eb5310;border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
                <p
                  style="margin:0 0 10px;color:#666;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                  Your verification code</p>
                <p
                  style="margin:0;color:#eb5310;font-size:42px;font-weight:900;letter-spacing:8px;font-family:'Courier New',monospace;">
                  {{ $otp }}</p>
                <p style="margin:10px 0 0;color:#999;font-size:12px;">This code expires in <strong>10 minutes</strong>
                </p>
              </div>

              <p style="margin:20px 0;color:#555;font-size:14px;line-height:1.7;">
                If you didn't request this code, you can safely ignore this email — your account remains secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafc;padding:24px 40px;border-top:1px solid #eee;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                &copy; {{ date('Y') }} LetsShop. All rights reserved.<br />
                Dubai, UAE &bull; info@letsshop.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>

</html>