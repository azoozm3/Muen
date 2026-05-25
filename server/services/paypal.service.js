import { serverEnv } from "../config/app-env.js";

const PAYPAL_BASE = serverEnv.paypalMode === "production" || serverEnv.paypalMode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`PayPal token error: ${data.error_description || data.error || "token request failed"}`);
  return data.access_token;
}

export async function capturePayPalOrder(orderId) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok || data.status !== "COMPLETED") {
    throw new Error(`PayPal capture failed: ${data.message || data.status || "Unknown error"}`);
  }
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  const amountValue = capture?.amount?.value || "1.00";
  const amountCurrency = capture?.amount?.currency_code || "USD";
  if (amountValue !== "1.00" || amountCurrency !== "USD") {
    throw new Error(`PayPal capture amount mismatch: expected 1.00 USD, got ${amountValue} ${amountCurrency}`);
  }
  return {
    paypalOrderId: data.id,
    paypalCaptureId: capture?.id || null,
    paypalStatus: data.status,
    paypalAmount: amountValue,
    paypalCurrency: amountCurrency,
  };
}
