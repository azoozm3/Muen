import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { PatientRouteTracker } from "@/components/patient/PatientRouteTracker";
import { apiRequest, readJsonResponse } from "@/lib/queryClient";
import { ACTIVE_REQUEST_STORAGE_KEY, CLOSED_REQUEST_STATUSES } from "./patientConstants";
import { getRequestStatusMessage, getRequestStatusTitle } from "./patientUtils";
import { DoctorRatingForm } from "./status-card/DoctorRatingForm";
import { DetailRow, LiveSharingNotice, RequestStatusIcon } from "./status-card/PatientStatusParts";

export function PatientStatusCard({ request, navigate, updateStatus, setActiveRequestId }) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonNote, setCancelReasonNote] = useState("");
  const requestId = request.id || request._id;
  const isClosed = CLOSED_REQUEST_STATUSES.includes(request.status);
  const hasResponder = request.status !== "pending";
  const canRateDoctor = request.status === "resolved" && request.primaryResponderRole === "doctor" && !request.reviewSubmitted;

  const handleSubmitReview = async () => {
    if (!rating) {
      toast({ title: "Choose a rating first", variant: "destructive" });
      return;
    }

    try {
      setIsSavingReview(true);
      const res = await apiRequest("POST", `/api/requests/${requestId}/review`, { rating, comment });
      await readJsonResponse(res, "Failed to save review");
      toast({ title: "Doctor rating saved" });
      navigate("/dashboard/patient");
    } catch (error) {
      toast({ title: "Review failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleCancel = () => {
    if (!cancelReason) {
      toast({ title: "Choose cancel reason", variant: "destructive" });
      return;
    }
    updateStatus.mutate(
      { requestId, status: "cancelled", cancelReason, cancelReasonNote: cancelReason === "Other" ? cancelReasonNote : "" },
      {
        onSuccess: () => {
          setActiveRequestId(null);
          localStorage.removeItem(ACTIVE_REQUEST_STORAGE_KEY);
          navigate("/dashboard/patient");
        },
      },
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-slate-900 p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/20"><RequestStatusIcon status={request.status} /></div>
          <h2 className="text-2xl font-bold">{getRequestStatusTitle(request.status)}</h2>
          <p className="mt-2 text-slate-300">Request ID: #{request.publicCaseId || requestId}</p>
        </div>

        <div className="p-8">
          <div className="mb-6 flex justify-center"><StatusBadge status={request.status} className="px-4 py-1 text-sm" /></div>

          <div className="space-y-4 rounded-xl bg-slate-50 p-6">
            <DetailRow label="Patient" value={request.name} />
            <DetailRow label="Location" value={request.location} multiLine />
            <LiveSharingNotice />
            <div className="pt-2"><span className="mb-1 block text-sm text-muted-foreground">Status Update:</span><p className="font-medium">{getRequestStatusMessage(request.status)}</p></div>
          </div>

          {hasResponder && !isClosed ? <PatientRouteTracker request={request} /> : null}
          {canRateDoctor ? <DoctorRatingForm rating={rating} comment={comment} setRating={setRating} setComment={setComment} isSavingReview={isSavingReview} onSubmit={handleSubmitReview} /> : null}
          {request.reviewSubmitted ? <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">Doctor rating already submitted</div> : null}

          {!isClosed ? (
            <div className="mt-6 space-y-3">
              <div>
                <p className="mb-2 text-sm font-medium">Why are you cancelling?</p>
                <select value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select reason</option>
                  <option value="I got help">I got help</option>
                  <option value="Mistake">Mistake</option>
                  <option value="No longer needed">No longer needed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {cancelReason === "Other" ? (
                <textarea value={cancelReasonNote} onChange={(event) => setCancelReasonNote(event.target.value)} placeholder="Write short reason..." className="min-h-[88px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
              ) : null}
              <Button onClick={handleCancel} className="w-full" variant="outline" disabled={updateStatus.isPending || !cancelReason}>{updateStatus.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}Cancel Request</Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/dashboard/patient")} className="mt-6 w-full" variant="outline"><Home className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
