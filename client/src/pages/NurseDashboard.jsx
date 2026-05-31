import { useQuery } from "@tanstack/react-query";
import ProfileIncompleteBanner from "@/components/common/ProfileIncompleteBanner";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useProfileIncompleteBanner } from "@/hooks/use-profile-incomplete-banner";
import { liveQueryOptions } from "@/lib/liveQuery";
import {
  ProviderDashboardHeader,
  ProviderDashboardShell,
  ProviderDashboardTabPanel,
  ProviderDashboardTabs,
} from "@/features/provider-dashboard/ProviderDashboardLayout";
import { ActiveNurseVisitsTab, NewNurseRequestsTab, NurseVisitHistoryTab } from "@/features/nurse-requests/provider/NurseDashboardSections";
import { useNurseDashboard } from "@/features/nurse-requests/provider/useNurseDashboard";

export default function NurseDashboard() {
  const { user } = useAuth();
  const dashboard = useNurseDashboard(user);
  const { data: profile } = useQuery({
    queryKey: ["/api/profiles/me"],
    ...liveQueryOptions(),
  });
  const isIncomplete = useProfileIncompleteBanner(profile);

  if (dashboard.isLoading) return <LoadingScreen className="min-h-[50vh]" />;

  return (
    <ProviderDashboardShell>
      {isIncomplete ? <ProfileIncompleteBanner /> : null}
      <ProviderDashboardHeader
        title="Nurse Care Dashboard"
        description={`Welcome, ${user?.name}. Review home-care requests, patient records, and complete visit reports.`}
      />
      <ProviderDashboardTabs value={dashboard.activeTab} onValueChange={dashboard.setActiveTab} tabs={dashboard.tabs}>
        <ProviderDashboardTabPanel value="new">
          <NewNurseRequestsTab items={dashboard.groups.pending} onAccept={(item) => dashboard.respond(item, "accepted")} isPending={dashboard.respondMutation.isPending} />
        </ProviderDashboardTabPanel>
        <ProviderDashboardTabPanel value="active">
          <ActiveNurseVisitsTab
            items={dashboard.groups.active}
            getReport={dashboard.getReport}
            updateReport={dashboard.updateReport}
            saveReport={dashboard.saveReport}
            updateStatus={dashboard.updateStatus}
            reportMutation={dashboard.reportMutation}
            statusMutation={dashboard.statusMutation}
          />
        </ProviderDashboardTabPanel>
        <ProviderDashboardTabPanel value="history">
          <NurseVisitHistoryTab items={dashboard.groups.completed} onRatePatient={dashboard.handleSavePatientRating} />
        </ProviderDashboardTabPanel>
      </ProviderDashboardTabs>
    </ProviderDashboardShell>
  );
}
