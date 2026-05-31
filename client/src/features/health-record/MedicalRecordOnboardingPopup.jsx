import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import HealthRecordEditor from "./HealthRecordEditor";
import { normalizeMedicalHistory } from "./healthRecordUtils";

export function MedicalRecordOnboardingPopup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rows, setRows] = useState(normalizeMedicalHistory([]));
  const isOpen = user?.role === "patient" && user?.medicalRecordAcknowledged === false;

  const acknowledgeMutation = useMutation({
    mutationFn: () => apiRequest("PATCH", "/api/profiles/acknowledge-medical-record"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const filled = rows.filter((row) => row.title?.trim() || row.details?.trim());
      if (filled.length > 0) await apiRequest("PATCH", "/api/profiles", { medicalHistory: filled });
      await apiRequest("PATCH", "/api/profiles/acknowledge-medical-record");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] });
    },
  });

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()} hideCloseButton>
        <DialogHeader><DialogTitle>Complete Your Medical Record</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">Please add your medical history so doctors can provide better care.</p>
        <HealthRecordEditor value={rows} onChange={setRows} />
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="ghost" disabled={acknowledgeMutation.isPending} onClick={() => acknowledgeMutation.mutate()}>Skip for now</Button>
          <Button type="button" disabled={saveMutation.isPending} onClick={() => saveMutation.mutate()}>{saveMutation.isPending ? "Saving..." : "Save & Continue"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
