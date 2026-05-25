import { AlertTriangle, ArrowLeft, Loader2, LocateFixed, MapPin } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LiveLocationMap } from "@/components/LiveLocationMap";
import PayPalCheckout from "@/components/payment/PayPalCheckout";
import { useServiceSettings } from "@/hooks/use-service-settings";

export function PatientEmergencyForm({ form, geoState, hasGpsCoordinates, createRequest, navigate, paymentDone, paypalError, handlePayPalSuccess, handlePayPalError }) {
  const { data: serviceSettings } = useServiceSettings();
  const paypalClientId = serviceSettings?.paymentProvider?.paypalClientIdPublic;
  const emergencyPricing = serviceSettings?.servicePricing?.emergencyRequest || { price: 1, currency: "USD" };
  const emergencyPrice = Number(emergencyPricing.price ?? 1).toFixed(2);
  const emergencyCurrency = emergencyPricing.currency || "USD";

  const formValues = form.watch();
  const formReady = Boolean(formValues.location?.trim() && hasGpsCoordinates);
  const handlePaymentApproved = (orderID) => {
    form.setValue("paypalOrderId", orderID, { shouldValidate: true });
    return form.handleSubmit((data) => handlePayPalSuccess(orderID, { ...data, paypalOrderId: orderID }))();
  };
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard/patient")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Emergency Request</h1>
          <p className="mt-2 text-muted-foreground">Share your location and send the request</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-lg sm:p-8">
          <Form {...form}>
            <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <FormLabel className="mb-0">Location</FormLabel>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {geoState.isLocating ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Detecting GPS
                          </>
                        ) : hasGpsCoordinates ? (
                          <>
                            <LocateFixed className="h-3.5 w-3.5 text-emerald-600" /> Live GPS ready
                          </>
                        ) : null}
                      </div>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input {...field} placeholder="Detecting location..." className="pl-10" />
                      </div>
                    </FormControl>
                    {geoState.error ? (
                      <p className="text-sm text-amber-700">{geoState.error}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Keep this screen open after sending so responders can follow your live GPS.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {hasGpsCoordinates ? (
                <LiveLocationMap
                  latitude={geoState.latitude}
                  longitude={geoState.longitude}
                  title="Preview your live map"
                  description="This is the map responders will see after you send the request."
                  height="h-52"
                />
              ) : null}

              <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
                <p className="text-sm font-medium">A <span className="font-bold text-primary">${emergencyPrice} {emergencyCurrency}</span> fee is required to submit an emergency request.</p>
                {createRequest.isPending ? (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm font-medium text-green-700">
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending emergency request...
                  </div>
                ) : paymentDone ? (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2"><span className="text-sm font-medium text-green-600">✓ Payment confirmed, sending request</span></div>
                ) : (
                  <PayPalCheckout clientId={paypalClientId} serviceKey="emergencyRequest" currency={emergencyCurrency} disabled={!formReady || createRequest.isPending} validate={() => formReady} onApproved={handlePaymentApproved} onError={handlePayPalError} />
                )}
                {paypalError ? <p className="text-sm text-destructive">{paypalError}</p> : null}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
