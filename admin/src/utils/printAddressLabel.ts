export type ShippingAddress = {
  _id?: string;

  name?: string;
  phone?: string;

  address?: string;
  addressLine1?: string;
  addressLine2?: string;

  city?: string;
  state?: string;

  postalCode?: string;
  pincode?: string;

  country?: string;
};

const escapeHtml = (value?: string | null): string => {
  if (!value) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const printAddressLabel = (address: ShippingAddress): void => {
  if (typeof window === "undefined") {
    return;
  }

  // ============================================================
  // NORMALIZE DATA
  // ============================================================

  const customerName = escapeHtml(address.name?.trim() || "Customer");

  const phone = escapeHtml(address.phone?.trim() || "");

  const fullAddress = escapeHtml(
    (address.address || address.addressLine1 || "").trim(),
  );

  const secondAddressLine = escapeHtml(address.addressLine2?.trim() || "");

  const city = escapeHtml(address.city?.trim() || "");

  const state = escapeHtml(address.state?.trim() || "");

  const postalCode = escapeHtml(
    (address.postalCode || address.pincode || "").trim(),
  );

  const country = escapeHtml(address.country?.trim() || "India");

  // ============================================================
  // BUILD LOCATION
  // ============================================================

  const cityState = [city, state].filter(Boolean).join(", ");

  let cityStatePin = cityState;

  if (postalCode) {
    cityStatePin = cityState ? `${cityState} - ${postalCode}` : postalCode;
  }

  // ============================================================
  // OPEN PRINT WINDOW
  // ============================================================

  const printWindow = window.open("", "_blank", "width=700,height=900");

  if (!printWindow) {
    window.alert(
      "Unable to open print window. Please allow popups for this website.",
    );

    return;
  }

  // ============================================================
  // LABEL HTML
  // ============================================================

  const html = `
    <!DOCTYPE html>

    <html lang="en">

      <head>

        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          MYSMME Shipping Label
        </title>

        <style>

          @page {
            size: 100mm 150mm;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;

            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #000;
            background: #fff;
          }

          body {
            display: flex;
            justify-content: center;
          }

          .label {

            width: 100mm;
            min-height: 150mm;

            padding: 8mm;

            background: #fff;

          }

          .header {

            text-align: center;

          }

          .brand {

            font-size: 24px;
            line-height: 1;

            font-weight: 900;

            letter-spacing: 1.5px;

          }

          .website {

            margin-top: 5px;

            font-size: 10px;

            font-weight: 600;

          }

          .divider {

            margin-top: 14px;
            margin-bottom: 18px;

            border-top: 2px solid #000;

          }

          .ship-to {

            margin-bottom: 8px;

            font-size: 11px;

            font-weight: 800;

            letter-spacing: 1px;

          }

          .customer-name {

            margin-bottom: 12px;

            font-size: 19px;

            line-height: 1.25;

            font-weight: 900;

          }

          .address {

            font-size: 15px;

            line-height: 1.55;

            font-weight: 500;

            word-break: break-word;

          }

          .address-line {

            margin-bottom: 3px;

          }

          .location {

            margin-top: 7px;

            font-weight: 700;

          }

          .country {

            margin-top: 3px;

          }

          .phone {

            margin-top: 20px;

            padding-top: 11px;

            border-top: 1px solid #000;

            font-size: 15px;

            font-weight: 800;

          }

          .phone-label {

            font-size: 11px;

            font-weight: 600;

            text-transform: uppercase;

          }

          .footer {

            margin-top: 28px;

            padding-top: 10px;

            border-top: 1px dashed #777;

            text-align: center;

            font-size: 9px;

          }

          .footer strong {

            font-size: 10px;

          }

          @media print {

            html,
            body {

              width: 100mm;
              height: 150mm;

            }

            body {

              display: block;

            }

            .label {

              width: 100mm;
              min-height: 150mm;

              margin: 0;
              padding: 8mm;

            }

          }

        </style>

      </head>

      <body>

        <div class="label">

          <div class="header">

            <div class="brand">
              MYSMME
            </div>

            <div class="website">
              www.mysmme.com
            </div>

          </div>

          <div class="divider"></div>

          <div class="ship-to">
            SHIP TO
          </div>

          <div class="customer-name">
            ${customerName}
          </div>

          <div class="address">

            ${
              fullAddress
                ? `
                    <div class="address-line">
                      ${fullAddress}
                    </div>
                  `
                : ""
            }

            ${
              secondAddressLine
                ? `
                    <div class="address-line">
                      ${secondAddressLine}
                    </div>
                  `
                : ""
            }

            ${
              cityStatePin
                ? `
                    <div class="location">
                      ${cityStatePin}
                    </div>
                  `
                : ""
            }

            ${
              country
                ? `
                    <div class="country">
                      ${country}
                    </div>
                  `
                : ""
            }

          </div>

          ${
            phone
              ? `
                  <div class="phone">

                    <span class="phone-label">
                      Phone:
                    </span>

                    ${phone}

                  </div>
                `
              : ""
          }

          <div class="footer">

            <strong>
              MYSMME
            </strong>

            <br />

            Thank you for shopping with us

          </div>

        </div>

        <script>

          window.onload = function () {

            window.focus();

            setTimeout(function () {

              window.print();

            }, 300);

          };

          window.onafterprint = function () {

            window.close();

          };

        </script>

      </body>

    </html>
  `;

  // ============================================================
  // WRITE HTML
  // ============================================================

  printWindow.document.open();

  printWindow.document.write(html);

  printWindow.document.close();
};
