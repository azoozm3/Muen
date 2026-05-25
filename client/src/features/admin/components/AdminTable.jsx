import { useMemo, useState } from "react";
import { useGlobalPopups } from "@/context/GlobalPopupsContext";
import { AdminTableMobileRow } from "./admin-table/AdminTableMobileRow";
import { AdminTableToolbar } from "./admin-table/AdminTableToolbar";
import { getCellValue, makeOptions, normalizeFilterValue, normalizeValue } from "./admin-table/adminTableUtils";

const DEFAULT_FILTER_FIELDS = [{ key: "status", label: "All status" }];
const EMPTY_NAMES = new Set(["", "—", "unknown", "unassigned", "system"]);

function cleanText(value) {
  return String(value ?? "").trim();
}

function getProfileTarget(column, row, content) {
  const key = column.key;
  const text = cleanText(content);
  if (!text || EMPTY_NAMES.has(text.toLowerCase())) return null;

  if (column.profile === false) return null;
  if (column.profile) {
    const id = typeof column.profile.id === "function" ? column.profile.id(row) : row[column.profile.id];
    const role = typeof column.profile.role === "function" ? column.profile.role(row) : column.profile.role;
    return id ? { id: String(id), role: role || "provider" } : null;
  }

  if (key === "name") return row.id || row._id ? { id: String(row.id || row._id), role: row.role || "provider" } : null;
  if (key === "patientName") return row.patientId ? { id: String(row.patientId), role: "patient" } : null;
  if (key === "doctorName") return row.doctorId || row.providerId ? { id: String(row.doctorId || row.providerId), role: "doctor" } : null;
  if (key === "nurseName") return row.nurseId || row.providerId ? { id: String(row.nurseId || row.providerId), role: "nurse" } : null;
  if (key === "volunteerName") return row.volunteerId || row.providerId ? { id: String(row.volunteerId || row.providerId), role: "volunteer" } : null;
  if (key === "providerName") return row.providerId ? { id: String(row.providerId), role: row.providerType || row.providerRole || "provider" } : null;
  if (key === "responderName") return row.providerId || row.responderId || row.primaryResponderId || row.acceptedBy ? { id: String(row.providerId || row.responderId || row.primaryResponderId || row.acceptedBy), role: row.responderRole || row.providerType || "provider" } : null;
  if (key === "actorName") return row.actorId ? { id: String(row.actorId), role: row.actorRole || "provider" } : null;

  if (key.endsWith("Name")) {
    const base = key.slice(0, -4);
    const id = row[`${base}Id`];
    return id ? { id: String(id), role: row[`${base}Role`] || row.role || "provider" } : null;
  }

  return null;
}

function AdminProfileCell({ column, row }) {
  const popups = useGlobalPopups();
  const content = getCellValue(column, row);
  const canWrap = ["string", "number"].includes(typeof content);
  const target = canWrap ? getProfileTarget(column, row, content) : null;

  if (!target || !popups?.openProfile) return content;

  return (
    <button
      type="button"
      onClick={() => popups.openProfile(target)}
      className="max-w-full truncate text-left font-semibold text-primary underline-offset-4 transition hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30"
      title="Open profile"
    >
      {content}
    </button>
  );
}

export function AdminTable({ columns, rows, emptyText = "No data.", searchPlaceholder = "Search table", filterFields = DEFAULT_FILTER_FIELDS }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  const activeFilterFields = useMemo(
    () => filterFields.map((field) => ({ ...field, options: makeOptions(rows, field) })).filter((field) => field.options.length > 0),
    [filterFields, rows],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      for (const field of activeFilterFields) {
        const selectedValue = filters[field.key] || "all";
        if (selectedValue === "all") continue;
        const accessor = typeof field.getValue === "function" ? field.getValue : (item) => item?.[field.key];
        if (normalizeFilterValue(accessor(row)) !== selectedValue) return false;
      }
      return !query || normalizeValue(row).includes(query);
    });
  }, [activeFilterFields, filters, rows, search]);

  return (
    <div className="space-y-4">
      {rows.length > 0 ? (
        <AdminTableToolbar
          search={search}
          setSearch={setSearch}
          searchPlaceholder={searchPlaceholder}
          activeFilterFields={activeFilterFields}
          filters={filters}
          setFilters={setFilters}
          filteredCount={filteredRows.length}
          totalCount={rows.length}
        />
      ) : null}

      {!filteredRows.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">{rows.length ? "No matching results." : emptyText}</div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">{filteredRows.map((row, index) => <AdminTableMobileRow key={row.id || row._id || index} columns={columns} row={row} renderCell={(column, currentRow) => <AdminProfileCell column={column} row={currentRow} />} />)}</div>

          <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-card shadow-sm md:block">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-slate-100/90">
                <tr>{columns.map((column) => <th key={column.key} className="border-b border-slate-200 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">{column.label}</th>)}</tr>
              </thead>
              <tbody className="bg-card">
                {filteredRows.map((row, index) => (
                  <tr key={row.id || row._id || index} className="transition-colors hover:bg-slate-50">
                    {columns.map((column) => <td key={column.key} className="border-b border-slate-200 px-4 py-3 align-top text-sm leading-6 text-slate-900 last:border-b-0"><div className="min-w-0 break-words"><AdminProfileCell column={column} row={row} /></div></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
