import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getMinTime, getTodayLocal, isPastDateTime } from "@/lib/timeUtils";
import { useAuth } from "@/hooks/use-auth";
import { TIMEOUTS } from "@shared/constants";
import {
  applyUserDefaults,
  INITIAL_VOLUNTEER_REQUEST_FORM,
} from "./volunteerRequestPageUtils";
import { useVolunteerRequestActions } from "./hooks/useVolunteerRequestActions";
import { useVolunteerRequestFilters } from "./hooks/useVolunteerRequestFilters";
import { useVolunteerRequestList } from "./hooks/useVolunteerRequestList";

export function usePatientVolunteerRequestsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { requests, isLoading } = useVolunteerRequestList();
  const { current, history } = useVolunteerRequestFilters(requests);
  const {
    submitVolunteerRequest,
    cancelRequest,
    rateVolunteer,
    createMutation,
    cancelMutation,
    rateMutation,
  } = useVolunteerRequestActions();

  const [showForm, setShowForm] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [form, setForm] = useState(INITIAL_VOLUNTEER_REQUEST_FORM);

  useEffect(() => {
    setForm((currentValue) => applyUserDefaults(currentValue, user));
  }, [user?.name, user?.phone]);

  const updateForm = (key, value) => {
    setForm((currentValue) => {
      const nextValue = { ...currentValue, [key]: value };
      if (key === "requestedDate" && nextValue.requestedTime < getMinTime(value)) {
        nextValue.requestedTime = "";
      }
      return nextValue;
    });
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser does not support live location.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude.toFixed(6));
        const longitude = Number(position.coords.longitude.toFixed(6));

        setForm((currentValue) => ({
          ...currentValue,
          latitude,
          longitude,
          locationNote: currentValue.locationNote || "GPS pinned",
        }));

        setIsLocating(false);
        toast({ title: "Live location captured" });
      },
      () => {
        setIsLocating(false);
        toast({
          title: "Could not get location",
          description: "Allow location access and try again.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: TIMEOUTS.API_REQUEST, maximumAge: 0 },
    );
  };

  const submitRequest = async (event) => {
    event.preventDefault();

    if (isPastDateTime(form.requestedDate, form.requestedTime)) {
      toast({
        title: "Choose a future time",
        description: "Volunteer requests cannot be scheduled in the past.",
        variant: "destructive",
      });
      return;
    }

    const created = await submitVolunteerRequest(form);
    if (!created) return;

    setForm((currentValue) => ({
      ...INITIAL_VOLUNTEER_REQUEST_FORM,
      requestedDate: getTodayLocal(),
      patientName: currentValue.patientName,
      patientPhone: currentValue.patientPhone,
    }));

    setShowForm(false);
  };

  return {
    isLoading,
    current,
    history,
    showForm,
    setShowForm,
    isLocating,
    form,
    updateForm,
    captureLocation,
    submitRequest,
    cancelRequest,
    rateVolunteer,
    createMutation,
    cancelMutation,
    rateMutation,
    cancelPending: cancelMutation.isPending,
    ratePending: rateMutation.isPending,
  };
}
