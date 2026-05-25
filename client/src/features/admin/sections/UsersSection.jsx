import { Button } from "@/components/ui/button";
import { AdminSectionCard } from "@/features/admin/components/AdminSectionCard";
import { AdminStatCard } from "@/features/admin/components/AdminStatCard";
import { AdminTable } from "@/features/admin/components/AdminTable";
import { formatDate, formatLabel, formatMoney } from "@/features/admin/utils/adminFormatters";

export function UsersSection({ title, subtitle, data, mutationState, onApprove, onReject, onToggleActive, onDelete }) {
  const users = data?.users || [];
  const summary = data?.summary || {};
  const role = users[0]?.role || "";
  const showProviderColumns = users.length > 0 && users.every((user) => user.role === role) && ["doctor", "nurse"].includes(role);

  const columns = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role", render: (row) => formatLabel(row.role) },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "specialty", label: "Specialty", render: (row) => row.specialty || "—" },
    {
      key: "approvalStatus",
      label: "Status",
      render: (row) => {
        const isPatient = row.role === "patient";
        const status = isPatient ? (row.active ? "enabled" : "disabled") : (row.approvalStatus || (row.active ? "approved" : "pending"));
        if (status === "pending") return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">Pending</span>;
        if (status === "approved") return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Approved</span>;
        return row.active
          ? <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Enabled</span>
          : <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">Disabled</span>;
      },
    },
  ];

  if (showProviderColumns) {
    columns.push(
      { key: "completedServices", label: "Completed" },
      { key: "unpaidJobs", label: "Unpaid Jobs" },
      { key: "dueAmount", label: "Due", render: (row) => formatMoney(row.dueAmount) },
      { key: "paidAmount", label: "Paid", render: (row) => formatMoney(row.paidAmount) },
    );
  }

  columns.push(
    { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const isPatient = row.role === "patient";
        const status = isPatient ? (row.active ? "enabled" : "disabled") : (row.approvalStatus || (row.active ? "approved" : "pending"));
        return (
          <div className="flex flex-wrap gap-2">
            {!isPatient && status === "pending" ? (
              <>
                <Button type="button" size="sm" disabled={mutationState} className="bg-green-600 text-white hover:bg-green-700" onClick={() => onApprove(row)}>Approve</Button>
                <Button type="button" variant="destructive" size="sm" disabled={mutationState} onClick={() => onReject(row)}>Reject</Button>
              </>
            ) : null}

            {(isPatient || status === "approved") ? (
              <>
                <Button type="button" size="sm" variant="outline" disabled={mutationState} onClick={() => onToggleActive(row)}>{row.active ? "Disable" : "Enable"}</Button>
                <Button type="button" variant="destructive" size="sm" disabled={mutationState} onClick={() => onDelete(row)}>Delete</Button>
              </>
            ) : null}

            
          </div>
        );
      },
    },
  );

  return (
    <div className="space-y-6">
      <div className={`grid gap-4 ${showProviderColumns ? "md:grid-cols-6" : "md:grid-cols-4"}`}>
        <AdminStatCard label="Total" value={summary.total || 0} />
        <AdminStatCard label="Active" value={summary.active || 0} />
        <AdminStatCard label="Inactive" value={summary.inactive || 0} />
        <AdminStatCard label="Online Consult" value={summary.onlineConsultationEnabled || 0} />
        {showProviderColumns ? <AdminStatCard label="Completed Jobs" value={summary.totalCompletedServices || 0} /> : null}
        {showProviderColumns ? <AdminStatCard label="Total Due" value={formatMoney(summary.totalDueAmount)} /> : null}
      </div>

      <AdminSectionCard title={title} subtitle={subtitle}>
        <AdminTable columns={columns} rows={users} emptyText="No users found." />
      </AdminSectionCard>
    </div>
  );
}
