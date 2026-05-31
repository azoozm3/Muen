import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AdminShell } from "@/features/admin/components/AdminShell";
import { ADMIN_ROLE_FILTERS, ADMIN_SECTIONS } from "@/features/admin/adminSections";
import { AdminErrorState, AdminLoadingState } from "@/features/admin/components/AdminFeedbackStates";
import {
  useAdminAnalytics,
  useAdminAppointments,
  useAdminDashboard,
  useAdminPayments,
  useAdminRequests,
  useAdminSettings,
  useAdminUsers,
  useDeleteAdminUser,
  useUpdateAdminSettings,
  useUpdateAdminUserStatus,
} from "@/features/admin/hooks/useAdminData";
import { getSectionFromPath, getSectionState } from "@/features/admin/adminPageUtils";
import { AdminContentRenderer } from "@/features/admin/AdminContentRenderer";

export default function AdminDashboard() {
  const [location, navigate] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const section = getSectionFromPath(location);
  const roleFilter = ADMIN_ROLE_FILTERS[section] || "all";
  const queries = {
    dashboardQuery: useAdminDashboard(),
    usersQuery: useAdminUsers(roleFilter),
    requestsQuery: useAdminRequests(),
    appointmentsQuery: useAdminAppointments(),
    paymentsQuery: useAdminPayments(),
    analyticsQuery: useAdminAnalytics(),
    settingsQuery: useAdminSettings(),
  };

  const updateUserMutation = useUpdateAdminUserStatus();
  const deleteUserMutation = useDeleteAdminUser();
  const updateSettingsMutation = useUpdateAdminSettings();
  const sectionState = useMemo(() => getSectionState(section, queries), [queries, section]);
  const volunteerPageLoading = section === "volunteers" && (queries.usersQuery.isLoading || queries.requestsQuery.isLoading);
  const volunteerPageError = section === "volunteers" ? queries.usersQuery.error || queries.requestsQuery.error : null;

  const handleSectionChange = (nextSection) => {
    const target = ADMIN_SECTIONS.find((item) => item.key === nextSection)?.path || "/dashboard/admin";
    navigate(target);
  };
  const handleApprove = async (user) => {
    try {
      await updateUserMutation.mutateAsync({ userId: user.id, active: true, approvalStatus: "approved" });
      toast({ title: "Approved", description: `${user.name} is now approved.` });
    } catch (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  };

  const handleReject = async (user) => {
    if (!window.confirm(`Reject ${user.name}? This will permanently delete the account and approval request.`)) return;
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast({ title: "Rejected", description: `${user.name} was rejected and deleted.` });
    } catch (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await updateUserMutation.mutateAsync({ userId: user.id, active: !user.active, approvalStatus: "approved" });
      toast({ title: "Updated", description: `${user.name} is now ${user.active ? "disabled" : "active"}.` });
    } catch (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    }
  };
  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast({ title: "Deleted", description: `${user.name} was removed.` });
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };
  const handleSaveSettings = async (payload) => {
    try {
      await updateSettingsMutation.mutateAsync(payload);
      toast({ title: "Saved", description: "Settings updated successfully." });
    } catch (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const content = volunteerPageLoading || sectionState.isLoading
    ? <AdminLoadingState />
    : volunteerPageError || sectionState.error
      ? <AdminErrorState message={(volunteerPageError || sectionState.error)?.message} />
      : AdminContentRenderer(section, {
          ...queries,
          deleteUserMutation,
          handleDelete,
          handleSaveSettings,
          handleApprove,
          handleReject,
          handleToggleActive,
          updateSettingsMutation,
          updateUserMutation,
        });

  return (
    <AdminShell
      title="Admin Dashboard"
      subtitle="Manage users, requests, appointments, payments, analytics, and settings."
      sections={ADMIN_SECTIONS}
      activeSection={section}
      onSectionChange={handleSectionChange}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
    >
      {content}
    </AdminShell>
  );
}
