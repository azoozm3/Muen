import { useEffect, useRef } from "react";
import { loadPaypalSdk } from "@/components/payment/paypal/sdk";

export default function EmergencyPayPalButton({ onSuccess, onError, disabled, clientId }) {
  const containerRef = useRef(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (renderedRef.current || disabled) return;
    if (!clientId) {
      onError?.("PayPal is not configured yet.");
      return;
    }
    if (!containerRef.current) return;

    renderedRef.current = true;

    async function renderPaypalButton() {
      try {
        const paypal = await loadPaypalSdk(clientId, "USD");
        await paypal
          .Buttons({
            style: { layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 45 },
            createOrder: (_data, actions) =>
              actions.order.create({
                purchase_units: [
                  {
                    amount: { value: "1.00", currency_code: "USD" },
                    description: "Emergency Help Request Fee",
                  },
                ],
              }),
            onApprove: async (data) => onSuccess?.(data.orderID),
            onError: () => onError?.("PayPal encountered an error. Please try again."),
            onCancel: () => onError?.("Payment was cancelled."),
          })
          .render(containerRef.current);
      } catch (error) {
        renderedRef.current = false;
        onError?.(error.message || "Failed to load PayPal SDK");
      }
    }

    renderPaypalButton();
  }, [clientId, disabled, onError, onSuccess]);

  return disabled ? <p className="py-2 text-center text-sm text-muted-foreground">Please fill in all required fields before paying.</p> : <div ref={containerRef} />;
}
