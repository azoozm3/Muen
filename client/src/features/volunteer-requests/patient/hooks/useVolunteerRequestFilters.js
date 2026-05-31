import { useMemo } from "react";
import { splitVolunteerRequests } from "../volunteerRequestPageUtils";

export function useVolunteerRequestFilters(requests) {
  return useMemo(() => splitVolunteerRequests(requests), [requests]);
}
