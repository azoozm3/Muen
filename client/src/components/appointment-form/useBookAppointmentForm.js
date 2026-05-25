import { useEffect, useMemo, useState } from "react";
import { getMinTime } from "@/lib/timeUtils";

function normalizeTime(value = "") {
  return String(value || "").slice(0, 5);
}

export function useBookAppointmentForm(doctor) {
  const [form, setForm] = useState({
    date: "",
    time: "",
    reason: "",
    appointmentType: doctor?.onlineConsultation ? "online" : "in_person",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [clinicAddress, setClinicAddress] = useState(null);
  const [hasConfiguredAvailability, setHasConfiguredAvailability] = useState(false);

  const doctorId = doctor?.id || doctor?._id || "";
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const availableDays = useMemo(() => new Set((doctor?.availableSlots || []).map((slot) => slot.day)), [doctor]);
  const isOnlineConsultation = form.appointmentType === "online";
  const isDoctorUnavailable = doctor?.availabilityStatus === "unavailable";
  const canSubmit = useMemo(() => Boolean(!isDoctorUnavailable && doctorId && form.date && form.time), [isDoctorUnavailable, doctorId, form.date, form.time]);
  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    setForm((prev) => {
      if (doctor?.onlineConsultation) return prev;
      return prev.appointmentType === "online" ? { ...prev, appointmentType: "in_person" } : prev;
    });
  }, [doctor?.onlineConsultation]);

  useEffect(() => {
    if (!doctorId || !form.date) {
      setAvailableSlots([]);
      setClinicAddress(null);
      setHasConfiguredAvailability(false);
      return;
    }

    let active = true;
    setSlotsLoading(true);

    fetch(`/api/doctors/${doctorId}/available-slots?date=${encodeURIComponent(form.date)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load slots"))))
      .then((data) => {
        if (!active) return;
        const slots = Array.isArray(data.slots) ? data.slots.map(normalizeTime).filter(Boolean) : [];
        const minTime = getMinTime(form.date);
        const filtered = slots.filter((slot) => slot >= minTime);
        setAvailableSlots(filtered);
        setClinicAddress(data.clinicAddress || null);
        setHasConfiguredAvailability(Boolean(data.hasConfiguredAvailability));
        if (data.hasConfiguredAvailability && form.time && !filtered.includes(normalizeTime(form.time))) {
          setForm((prev) => ({ ...prev, time: "" }));
        }
      })
      .catch(() => {
        if (!active) return;
        setAvailableSlots([]);
        setClinicAddress(null);
        setHasConfiguredAvailability(false);
      })
      .finally(() => {
        if (active) setSlotsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [doctorId, form.date, form.time]);

  return {
    form,
    doctorId,
    minDate,
    canSubmit,
    updateField,
    availableSlots,
    slotsLoading,
    clinicAddress,
    hasConfiguredAvailability,
    isOnlineConsultation,
    availableDays,
    isDoctorUnavailable,
  };
}
