import { useEffect, useMemo, useState } from "react";
import { getMinTime } from "@/lib/timeUtils";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function normalizeTime(value = "") {
  return String(value || "").slice(0, 5);
}

function normalizeDay(value = "") {
  return DAY_NAMES.find((day) => day.toLowerCase() === String(value || "").trim().toLowerCase()) || null;
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
  const availableDays = useMemo(() => new Set((doctor?.availableSlots || []).map((slot) => normalizeDay(slot.day)).filter(Boolean)), [doctor]);
  const isOnlineConsultation = form.appointmentType === "online";
  const isDoctorUnavailable = doctor?.availabilityStatus === "unavailable";
  const canSubmit = useMemo(() => Boolean(!isDoctorUnavailable && doctorId && form.date && form.time), [isDoctorUnavailable, doctorId, form.date, form.time]);
  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value, ...(key === "date" ? { time: "" } : {}) }));

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
      setHasConfiguredAvailability(availableDays.size > 0);
      return;
    }

    let active = true;
    setSlotsLoading(true);

    async function loadSlots() {
      try {
        const res = await fetch(`/api/doctors/${doctorId}/available-slots?date=${encodeURIComponent(form.date)}`);
        if (!res.ok) throw new Error("Failed to load slots");
        const data = await res.json();
        if (!active) return;
        const slots = Array.isArray(data.slots) ? data.slots.map(normalizeTime).filter(Boolean) : [];
        const minTime = getMinTime(form.date);
        const filtered = slots.filter((slot) => slot >= minTime);
        setAvailableSlots(filtered);
        setClinicAddress(data.clinicAddress || null);
        setHasConfiguredAvailability(Boolean(data.hasConfiguredAvailability) || availableDays.size > 0);
        if (data.hasConfiguredAvailability && form.time && !filtered.includes(normalizeTime(form.time))) {
          setForm((prev) => ({ ...prev, time: "" }));
        }
      } catch (error) {
        if (!active) return;
        setAvailableSlots([]);
        setClinicAddress(null);
        setHasConfiguredAvailability(availableDays.size > 0);
      } finally {
        if (active) setSlotsLoading(false);
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [doctorId, form.date, availableDays]);

  return {
    form,
    doctorId,
    minDate,
    canSubmit,
    updateField,
    availableSlots,
    slotsLoading,
    clinicAddress,
    hasConfiguredAvailability: hasConfiguredAvailability || availableDays.size > 0,
    isOnlineConsultation,
    availableDays,
    isDoctorUnavailable,
  };
}
