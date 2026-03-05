<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed — LetsShop</title>
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#eb5310,#ff7a45);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;">Lets<span
                  style="color:#ffe0c0;">Shop</span></h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">✅ Your Order is Confirmed!</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;color:#333;font-size:16px;line-height:1.6;">
                Hi <strong>{{ $user->full_name }}</strong>, thank you for your order! We've received it and will begin
                processing shortly.
              </p>
            </td>
          </tr>

          <!-- Order Info -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:#fff8f5;border-radius:12px;padding:20px;border:1px solid #fde8db;">
                <tr>
                  <td width="50%" style="padding:8px 12px;">
                    <p style="margin:0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Order Number
                    </p>
                    <p style="margin:4px 0 0;font-size:16px;color:#eb5310;font-weight:800;">{{ $order->order_number }}
                    </p>
                  </td>
                  <td width="50%" style="padding:8px 12px;">
                    <p style="margin:0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Date</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#333;font-weight:600;">
                      {{ $order->created_at->format('d M Y, H:i') }}</p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:8px 12px;">
                    <p style="margin:0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Payment
                      Method</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#333;font-weight:600;">
                      {{ strtoupper($order->payment_method) }}</p>
                  </td>
                  <td width="50%" style="padding:8px 12px;">
                    <p style="margin:0;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Status</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#d69e2e;font-weight:800;">⏳ Pending</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h3
                style="margin:0 0 14px;color:#333;font-size:16px;font-weight:700;border-bottom:2px solid #f4f6f8;padding-bottom:10px;">
                Order Items</h3>
              @foreach($order->items as $item)
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                  <tr>
                    <td style="padding:8px 0;">
                      <p style="margin:0;color:#333;font-size:14px;font-weight:600;">
                        {{ $item->product->name ?? 'Product' }}</p>
                      <p style="margin:3px 0 0;color:#888;font-size:12px;">Qty: {{ $item->quantity }}</p>
                    </td>
                    <td style="text-align:right;padding:8px 0;">
                      <p style="margin:0;color:#eb5310;font-size:14px;font-weight:700;">
                        {{ $order->currency === 'INR' ? '₹' : 'AED ' }}{{ number_format($item->price * $item->quantity, 2) }}
                      </p>
                    </td>
                  </tr>
                </table>
              @endforeach

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border-top:2px solid #f4f6f8;margin-top:12px;padding-top:12px;">
                <tr>
                  <td style="padding:8px 0;">
                    <p style="margin:0;color:#888;font-size:13px;">Subtotal</p>
                  </td>
                  <td style="text-align:right;padding:8px 0;">
                    <p style="margin:0;color:#555;font-size:13px;">
                      {{ $order->currency === 'INR' ? '₹' : 'AED ' }}{{ number_format($order->subtotal, 2) }}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <p style="margin:0;color:#888;font-size:13px;">Tax (5%)</p>
                  </td>
                  <td style="text-align:right;padding:4px 0;">
                    <p style="margin:0;color:#555;font-size:13px;">
                      {{ $order->currency === 'INR' ? '₹' : 'AED ' }}{{ number_format($order->tax, 2) }}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;">
                    <p style="margin:0;color:#888;font-size:13px;">Shipping</p>
                  </td>
                  <td style="text-align:right;padding:4px 0;">
                    <p style="margin:0;color:#22a06b;font-size:13px;font-weight:600;">FREE</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0;">
                    <p style="margin:0;color:#333;font-size:16px;font-weight:800;">Total</p>
                  </td>
                  <td style="text-align:right;padding:12px 0 0;">
                    <p style="margin:0;color:#eb5310;font-size:18px;font-weight:800;">
                      {{ $order->currency === 'INR' ? '₹' : 'AED ' }}{{ number_format($order->total_amount, 2) }}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address -->
          @if($order->delivery_address)
            <tr>
              <td style="padding:20px 40px 0;">
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="background:#f9fafc;border-radius:10px;padding:16px;">
                  <tr>
                    <td>
                      <p style="margin:0 0 6px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">📍
                        Delivery Address</p>
                      <p style="margin:0;color:#333;font-size:14px;line-height:1.6;">{{ $order->delivery_address }}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          @endif

          <!-- CTA -->
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <a href="{{ config('app.url') }}/orders"
                style="display:inline-block;background:#eb5310;color:#fff;text-decoration:none;padding:14px 32px;border-radius:30px;font-weight:700;font-size:15px;">
                View My Orders →
              </a>
              <p style="margin:16px 0 0;color:#aaa;font-size:13px;">Questions? Email us at <a
                  href="mailto:info@letsshop.com" style="color:#eb5310;">info@letsshop.com</a></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafc;padding:20px 40px;border-top:1px solid #eee;text-align:center;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                &copy; {{ date('Y') }} LetsShop. All rights reserved. Dubai, UAE.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>

</html>