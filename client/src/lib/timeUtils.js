export function getMinTime(selectedDate) {
  const today = new Date().toISOString().slice(0, 10);
  if (selectedDate !== today) return "00:00";
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
