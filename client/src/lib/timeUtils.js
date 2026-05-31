export function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMinTime(selectedDate) {
  const today = getTodayLocal();
  if (selectedDate !== today) return "00:00";
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function isPastDateTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) return false;
  const selectedDateTime = new Date(`${dateValue}T${timeValue}:00`);
  return Number.isNaN(selectedDateTime.getTime()) || selectedDateTime < new Date();
}
