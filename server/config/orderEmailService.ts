import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

interface OrderEmailParams {
  order: any;
  customer: {
    name?: string;
    email?: string;
  };
  shippingAddress?: any;
}

export const sendOrderConfirmationEmails = async ({
  order,
  customer,
  shippingAddress,
}: OrderEmailParams) => {
  const customerEmail = customer?.email;
  const adminEmail = process.env.ADMIN_ORDER_EMAIL;

  const orderNumber = order._id.toString().slice(-8).toUpperCase();

  const itemsHtml = order.items
    .map(
      (item: any) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee;">
            ${item.productName}
          </td>

          <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">
            ${item.quantity}
          </td>

          <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
            ${money(item.unitPrice)}
          </td>

          <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">
            ${money(item.totalPrice)}
          </td>
        </tr>
      `,
    )
    .join("");

  const addressHtml = shippingAddress
    ? `
      ${shippingAddress.name ? `${shippingAddress.name}<br />` : ""}
      ${shippingAddress.addressLine1 || ""}<br />
      ${shippingAddress.addressLine2 ? `${shippingAddress.addressLine2}<br />` : ""}
      ${[shippingAddress.city, shippingAddress.state, shippingAddress.pincode]
        .filter(Boolean)
        .join(", ")}
      ${
        shippingAddress.phoneNumber
          ? `<br />Phone: ${shippingAddress.phoneNumber}`
          : ""
      }
    `
    : "Address not available";

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#222">

      <h1 style="color:#db2777;margin-bottom:5px;">
        MYSMME
      </h1>

      <h2>Thank you for your order!</h2>

      <p>
        Hi ${customer?.name || "Customer"},
      </p>

      <p>
        Your order has been confirmed successfully.
      </p>

      <div style="background:#fff1f7;padding:15px;border-radius:8px;margin:20px 0;">
        <strong>Order #${orderNumber}</strong><br />
        Payment Status: Paid<br />
        Order Status: Processing
      </div>

      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th style="padding:10px;text-align:left;border-bottom:2px solid #eee;">
              Product
            </th>

            <th style="padding:10px;border-bottom:2px solid #eee;">
              Qty
            </th>

            <th style="padding:10px;text-align:right;border-bottom:2px solid #eee;">
              Price
            </th>

            <th style="padding:10px;text-align:right;border-bottom:2px solid #eee;">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top:20px;text-align:right;">
        <p>
          Subtotal:
          <strong>${money(order.subtotal)}</strong>
        </p>

        ${
          order.couponDiscount
            ? `
              <p>
                Coupon Discount:
                <strong>- ${money(order.couponDiscount)}</strong>
              </p>
            `
            : ""
        }

        <p>
          Shipping:
          <strong>${money(order.shippingCharge)}</strong>
        </p>

        <h2>
          Total: ${money(order.totalAmount)}
        </h2>
      </div>

      <h3>Delivery Address</h3>

      <p>
        ${addressHtml}
      </p>

      <p style="margin-top:30px;">
        We’ll let you know when your order is shipped.
      </p>

      <p>
        Thank you for shopping with MYSMME.
      </p>

    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#222">

      <h2>New MYSMME Order</h2>

      <p>
        A new paid order has been received.
      </p>

      <p>
        <strong>Order:</strong> #${orderNumber}
      </p>

      <p>
        <strong>Customer:</strong>
        ${customer?.name || "Customer"}
      </p>

      <p>
        <strong>Email:</strong>
        ${customerEmail || "N/A"}
      </p>

      <p>
        <strong>Total:</strong>
        ${money(order.totalAmount)}
      </p>

      ${
        order.couponCode
          ? `
            <p>
              <strong>Coupon:</strong>
              ${order.couponCode}
            </p>
          `
          : ""
      }

      <p>
        <strong>Payment:</strong> Completed
      </p>

      <h3>Items</h3>

      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <h3>Delivery Address</h3>

      <p>
        ${addressHtml}
      </p>

    </div>
  `;

  const jobs: Promise<any>[] = [];

  if (customerEmail) {
    jobs.push(
      transporter.sendMail({
        from: `"MYSMME" <${process.env.SMTP_FROM || process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Your MYSMME order #${orderNumber} is confirmed`,
        html: customerHtml,
      }),
    );
  }

  if (adminEmail) {
    jobs.push(
      transporter.sendMail({
        from: `"MYSMME Orders" <${process.env.SMTP_FROM || process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: `New MYSMME Order #${orderNumber} - ${money(order.totalAmount)}`,
        html: adminHtml,
      }),
    );
  }

  await Promise.all(jobs);
};
