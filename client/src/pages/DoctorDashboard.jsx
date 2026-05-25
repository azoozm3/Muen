import { CalendarCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ProfileIncompleteBanner from "@/components/common/ProfileIncompleteBanner";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useProfileIncompleteBanner } from "@/hooks/use-profile-incomplete-banner";
import { liveQueryOptions } from "@/lib/liveQuery";
import { ProviderDashboardHeader, ProviderDashboardShell, ProviderHeaderAction } from "@/features/provider-dashboard/ProviderDashboardLayout";
import { DoctorDashboardTabs } from "./doctor-dashboard/DoctorDashboardTabs";
import { useDoctorDashboard } from "./doctor-dashboard/useDoctorDashboard";

export default function DoctorDashboard() {
  const [, navigate] = useLocation();
  const dashboard = useDoctorDashboard();
  const { data: profile } = useQuery({
    queryKey: ["/api/profiles/me"],
    ...liveQueryOptions(),
  });
  const isIncomplete = useProfileIncompleteBanner(profile);

  if (dashboard.isLoading) {
    return <LoadingScreen className="min-h-[50vh]" />;
  }

  return (
    <ProviderDashboardShell>
      {isIncomplete ? <ProfileIncompleteBanner /> : null}
      <ProviderDashboardHeader
        title={`Welcome back, Dr. ${dashboard.user?.name || "Doctor"}`}
        description="Manage emergency cases, track routes, and support patients in real time."
        actions={(
          <>
            <ProviderHeaderAction icon={CalendarCheck} onClick={() => navigate("/dashboard/doctor/appointments")}>Appointments</ProviderHeaderAction>
          </>
        )}
      />

      <DoctorDashboardTabs
        activeTab={dashboard.activeTab}
        setActiveTab={dashboard.setActiveTab}
        tabs={dashboard.tabs}
        availableCases={dashboard.availableCases}
        myCases={dashboard.myCases}
        resolvedCases={dashboard.resolvedCases}
        updateStatus={dashboard.updateStatus}
        onAccept={dashboard.handleAccept}
        onStatusUpdate={dashboard.handleStatusUpdate}
        onRatePatient={dashboard.handleSavePatientRating}
      />
    </ProviderDashboardShell>
  );
}
