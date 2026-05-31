import { useQuery } from "@tanstack/react-query";
import ProfileIncompleteBanner from "@/components/common/ProfileIncompleteBanner";
import { useAuth } from "@/hooks/use-auth";
import { useProfileIncompleteBanner } from "@/hooks/use-profile-incomplete-banner";
import { liveQueryOptions } from "@/lib/liveQuery";
import { ProviderDashboardHeader, ProviderDashboardShell, ProviderDashboardTabPanel, ProviderDashboardTabs } from "@/features/provider-dashboard/ProviderDashboardLayout";
import { ActiveVolunteerRequestsTab, AvailableVolunteerRequestsTab, VolunteerHistoryTab } from "@/features/volunteer-requests/provider/VolunteerDashboardSections";
import { useVolunteerDashboardPage } from "@/features/volunteer-requests/provider/useVolunteerDashboardPage";

export default function VolunteerDashboardPageView() {
  const { user } = useAuth();
  const dashboard = useVolunteerDashboardPage(user?.id);
  const { data: profile } = useQuery({
    queryKey: ["/api/profiles/me"],
    ...liveQueryOptions(),
  });
  const isIncomplete = useProfileIncompleteBanner(profile);
  const tabs = [
    { value: "available", label: "Available", count: dashboard.available.length },
    { value: "active", label: "My Active", count: dashboard.active.length },
    { value: "history", label: "History", count: dashboard.history.length },
  ];

  return (
    <ProviderDashboardShell>
      {isIncomplete ? <ProfileIncompleteBanner /> : null}
      <ProviderDashboardHeader title="Volunteer Dashboard" description={`Welcome, ${user?.name}. Review open requests, manage your active support tasks, and track history.`} />
      <ProviderDashboardTabs defaultValue="available" tabs={tabs}>
        <ProviderDashboardTabPanel value="available"><AvailableVolunteerRequestsTab isLoading={dashboard.isLoading} items={dashboard.available} isPending={dashboard.acceptPending} onAccept={dashboard.acceptRequest} /></ProviderDashboardTabPanel>
        <ProviderDashboardTabPanel value="active"><ActiveVolunteerRequestsTab items={dashboard.active} isPending={dashboard.statusPending} onStart={(id) => dashboard.updateStatus(id, "in_progress")} onComplete={(id) => dashboard.updateStatus(id, "completed")} /></ProviderDashboardTabPanel>
        <ProviderDashboardTabPanel value="history"><VolunteerHistoryTab items={dashboard.history} isPending={dashboard.ratePending} onRatePatient={dashboard.ratePatient} /></ProviderDashboardTabPanel>
      </ProviderDashboardTabs>
    </ProviderDashboardShell>
  );
}
