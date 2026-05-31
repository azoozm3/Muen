import { useState } from "react";
import { AdminSectionCard } from "@/features/admin/components/AdminSectionCard";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { useAdminActivityLogs } from "@/features/admin/hooks/useAdminData";
import { formatDate, formatLabel } from "@/features/admin/utils/adminFormatters";
import { Button } from "@/components/ui/button";

function BreakdownCard({ title, data }) {
  return (
    <AdminSectionCard title={title} subtitle="Counts by status.">
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(data || {}).map(([key, value]) => (
          <AdminStatCard key={key} label={formatLabel(key)} value={value} />
        ))}
      </div>
    </AdminSectionCard>
  );
}

export function AnalyticsSection({ data }) {
  const [page, setPage] = useState(1);
  const { data: logsPage } = useAdminActivityLogs(page, 25);
  return (
    <div className="space-y-6">
      <AdminSectionCard title="Roles" subtitle="Users by role.">
        <div className="grid gap-4 md:grid-cols-5">
          {Object.entries(data?.roleBreakdown || {}).map(([key, value]) => (
            <AdminStatCard key={key} label={formatLabel(key)} value={value} />
          ))}
        </div>
      </AdminSectionCard>

      <div className="grid gap-6 xl:grid-cols-3">
        <BreakdownCard title="Emergency" data={data?.emergencyByStatus} />
        <BreakdownCard title="Nurse" data={data?.nurseByStatus} />
        <BreakdownCard title="Appointments" data={data?.appointmentByStatus} />
      </div>

      <AdminSectionCard title="Activity Log" subtitle="All logs with pagination.">
        <AdminTable
          columns={[
            { key: "actorName", label: "User" },
            { key: "actorRole", label: "Role", render: (row) => formatLabel(row.actorRole) },
            { key: "details", label: "Activity" },
            { key: "createdAt", label: "Time", render: (row) => formatDate(row.createdAt) },
          ]}
          rows={logsPage?.logs || []}
          emptyText="No activity."
        />
        <div className="mt-4 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setPage((value) => Math.max(value - 1, 1))} disabled={!logsPage?.hasPrevPage}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {logsPage?.page || 1} of {logsPage?.totalPages || 1}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((value) => value + 1)} disabled={!logsPage?.hasNextPage}>Next</Button>
        </div>
      </AdminSectionCard>
    </div>
  );
}
