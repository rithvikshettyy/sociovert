import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AnyFormat <noreply@anyformat.rithvikshetty.in>';

interface PlanPurchaseEmail {
  to: string;
  name: string;
  billingCycle: 'monthly' | 'yearly';
  paymentId: string;
  orderId: string;
}

export async function sendPlanPurchaseEmail({ to, name, billingCycle, paymentId, orderId }: PlanPurchaseEmail) {
  const isYearly = billingCycle === 'yearly';
  const amount = isYearly ? '6,000' : '599';
  const period = isYearly ? 'year' : 'month';
  const perMonth = isYearly ? '500' : '599';
  const expiryDays = isYearly ? 365 : 30;
  const expiryDate = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to AnyFormat Enterprise! 🎉`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#141414;border-radius:16px;border:1px solid #2a2a2a;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#e03d2f 0%,#c0392b 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">AnyFormat</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Enterprise Plan Activated</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#e0e0e0;font-size:16px;line-height:1.6;">
                Hi ${name || 'there'},
              </p>
              <p style="margin:0 0 24px;color:#e0e0e0;font-size:16px;line-height:1.6;">
                Your payment was successful and your <strong style="color:#ffffff;">Enterprise plan</strong> is now active. Here's what you unlocked:
              </p>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;margin-bottom:24px;">
                <tr><td style="padding:20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td style="padding:6px 0;color:#a0a0a0;font-size:14px;">✓ Unlimited short URLs</td></tr>
                    <tr><td style="padding:6px 0;color:#a0a0a0;font-size:14px;">✓ Custom aliases for branded links</td></tr>
                    <tr><td style="padding:6px 0;color:#a0a0a0;font-size:14px;">✓ Full click analytics dashboard</td></tr>
                    <tr><td style="padding:6px 0;color:#a0a0a0;font-size:14px;">✓ API access for integrations</td></tr>
                    <tr><td style="padding:6px 0;color:#a0a0a0;font-size:14px;">✓ Link management & deletion</td></tr>
                    <tr><td style="padding:6px 0;color:#a0a0a0;font-size:14px;">✓ Priority support</td></tr>
                  </table>
                </td></tr>
              </table>

              <!-- Order Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;margin-bottom:24px;">
                <tr><td style="padding:20px;">
                  <p style="margin:0 0 12px;color:#ffffff;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order Details</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;color:#808080;font-size:14px;">Plan</td>
                      <td style="padding:8px 0;color:#e0e0e0;font-size:14px;text-align:right;">Enterprise (${billingCycle})</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#808080;font-size:14px;">Amount</td>
                      <td style="padding:8px 0;color:#e0e0e0;font-size:14px;text-align:right;">₹${amount}/${period} (₹${perMonth}/mo)</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#808080;font-size:14px;">Valid until</td>
                      <td style="padding:8px 0;color:#e0e0e0;font-size:14px;text-align:right;">${expiryDate}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#808080;font-size:14px;">Payment ID</td>
                      <td style="padding:8px 0;color:#e0e0e0;font-size:14px;text-align:right;font-family:monospace;font-size:12px;">${paymentId}</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;color:#808080;font-size:14px;">Order ID</td>
                      <td style="padding:8px 0;color:#e0e0e0;font-size:14px;text-align:right;font-family:monospace;font-size:12px;">${orderId}</td>
                    </tr>
                  </table>
                </td></tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="https://anyformat.rithvikshetty.in/dashboard" style="display:inline-block;background-color:#e03d2f;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#808080;font-size:13px;line-height:1.6;">
                Your plan will automatically revert to Free after ${expiryDate}. You can renew anytime from the pricing page.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #2a2a2a;text-align:center;">
              <p style="margin:0;color:#606060;font-size:12px;">
                AnyFormat &mdash; Convert anything, shorten everything.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
  } catch (error) {
    console.error('Failed to send purchase email:', error);
  }
}
