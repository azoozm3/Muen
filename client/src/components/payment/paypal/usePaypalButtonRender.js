import { useEffect } from "react";
import { loadPaypalSdk } from "./sdk";
import { apiRequest, readJsonResponse } from "@/lib/queryClient";

export function usePaypalButtonRender({
  ref,
  clientId,
  currency,
  serviceKey,
  renderedKey,
  buttonsActionsRef,
  disabledRef,
  validateRef,
  onApprovedRef,
  onErrorRef,
  setLoading,
  setError,
}) {
  useEffect(() => {
    let cancelled = false;

    if (!ref.current || !clientId) {
      setLoading(false);
      return undefined;
    }

    ref.current.innerHTML = "";
    setLoading(true);
    setError("");

    const canUseButton = () => !disabledRef.current;

    const validateBeforePayment = () => {
      if (disabledRef.current) return false;

      if (typeof validateRef.current === "function") {
        return Boolean(validateRef.current());
      }

      return true;
    };

    const fail = (message) => {
      setError(message);
      onErrorRef.current?.(message);
    };

    async function renderPaypalButton() {
      try {
        const paypal = await loadPaypalSdk(clientId, currency);
        if (cancelled || !paypal?.Buttons) return;

        await paypal
          .Buttons({
            style: {
              layout: "vertical",
              shape: "rect",
              label: "paypal",
            },

            onInit: (_data, actions) => {
              buttonsActionsRef.current = actions;

              if (canUseButton()) {
                actions.enable();
              } else {
                actions.disable();
              }
            },

            onClick: (_data, actions) => {
              if (!validateBeforePayment()) {
                const message = "Please fix the request details before paying.";
                fail(message);
                return actions.reject();
              }

              setError("");
              return actions.resolve();
            },

            createOrder: async () => {
              if (!validateBeforePayment()) {
                throw new Error(
                  "Please fix the request details before paying.",
                );
              }

              const res = await apiRequest("POST", "/api/payments/orders", {
                serviceKey,
              });

              const data = await readJsonResponse(
                res,
                "Failed to create PayPal order",
              );

              return data.orderId;
            },

            onApprove: async (data) => {
              const res = await apiRequest("POST", "/api/payments/capture", {
                orderId: data.orderID,
                serviceKey,
              });

              const result = await readJsonResponse(
                res,
                "Failed to capture payment",
              );

              await onApprovedRef.current?.(data.orderID, result);
            },

            onError: (err) => {
              fail(err?.message || "PayPal failed");
            },
          })
          .render(ref.current);
      } catch (err) {
        if (!cancelled) {
          fail(err.message || "Failed to load PayPal");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    renderPaypalButton();

    return () => {
      cancelled = true;
      buttonsActionsRef.current = null;
    };
  }, [
    buttonsActionsRef,
    clientId,
    currency,
    disabledRef,
    onApprovedRef,
    onErrorRef,
    ref,
    renderedKey,
    serviceKey,
    setError,
    setLoading,
    validateRef,
  ]);
}
