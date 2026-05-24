export function getLocalDateKey(date) {

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;

}

export function formatDisplayDate(date) {

  if (!date) return "No date";

  const displayDate = new Date(`${date}T00:00:00`);

  return displayDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );

}

export function formatDisplayTime(time) {

  if (!time) return "No time";

  const [hours, minutes] = time.split(":");

  const displayTime = new Date();

  displayTime.setHours(Number(hours));
  displayTime.setMinutes(Number(minutes));

  return displayTime.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit"
    }
  );

}
