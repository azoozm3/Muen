import { useVolunteerRequests } from "@/hooks/use-volunteer-requests";

export function useVolunteerRequestList() {
  const query = useVolunteerRequests();

  return {
    requests: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
