import { useToast } from "@/hooks/use-toast";
import {
  useCancelVolunteerRequest,
  useCreateVolunteerRequest,
  useRateVolunteerRequest,
} from "@/hooks/use-volunteer-requests";

export function useVolunteerRequestActions() {
  const { toast } = useToast();
  const createMutation = useCreateVolunteerRequest();
  const cancelMutation = useCancelVolunteerRequest();
  const rateMutation = useRateVolunteerRequest();

  const submitVolunteerRequest = async (form) => {
    try {
      await createMutation.mutateAsync({ body: form });
      toast({ title: "Volunteer request created" });
      return true;
    } catch (error) {
      toast({
        title: "Could not create request",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelRequest = async (id) => {
    try {
      await cancelMutation.mutateAsync({ id });
      toast({ title: "Request cancelled" });
    } catch (error) {
      toast({
        title: "Could not cancel request",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const rateVolunteer = async (id, body) => {
    try {
      await rateMutation.mutateAsync({ id, body });
      toast({ title: `Volunteer rated successfully: ${body.rating} ★` });
    } catch (error) {
      toast({
        title: "Could not save rating",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return {
    submitVolunteerRequest,
    cancelRequest,
    rateVolunteer,
    createMutation,
    cancelMutation,
    rateMutation,
  };
}
