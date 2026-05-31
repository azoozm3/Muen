import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/common/BackButton";
import PublicProfileHeader from "@/features/profile/public/PublicProfileHeader";
import PublicProfileInfoRow from "@/features/profile/public/PublicProfileInfoRow";
import PublicProfileRatingsSection from "@/features/profile/public/PublicProfileRatingsSection";
import PublicProfileRecordsSection from "@/features/profile/public/PublicProfileRecordsSection";
import PublicProfileTextSection from "@/features/profile/public/PublicProfileTextSection";
import { buildPublicProfileSummary, getPublicProfileConfig } from "@/features/profile/public/profilePublicConfig";
import { usePublicProfile } from "@/features/profile/public/usePublicProfile";
import { Badge } from "@/components/ui/badge";
import { getScheduleSummary, isDoctorBookable } from "@/lib/doctorAvailability";

function getRecordRows(data) {
  if (Array.isArray(data?.medicalHistory) && data.medicalHistory.length) return data.medicalHistory;
  if (Array.isArray(data?.healthRecord) && data.healthRecord.length) return data.healthRecord;
  return [];
}

export default function PublicProfilePage({ profileRole, profileId, hideBack = false }) {
  const { data, isLoading, resolvedRole, error } = usePublicProfile(profileRole, profileId);
  const config = getPublicProfileConfig(resolvedRole);
  const summary = buildPublicProfileSummary(data);
  const records = getRecordRows(data);
  const ratings = Array.isArray(data?.providerRatings) ? data.providerRatings : [];
  const bio = data?.bio || data?.volunteerNotes || "";
  const doctorAvailability = resolvedRole === "doctor" ? getScheduleSummary(data) : null;
  const canBookDoctor = resolvedRole === "doctor" ? isDoctorBookable(data) : false;


  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      {!hideBack ? <BackButton fallbackPath={config.fallbackPath} /> : null}
      <Card className="rounded-3xl p-5 sm:p-7">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            <PublicProfileHeader
              data={data}
              profileLabel={config.profileLabel}
              ratingText={config.ratingText}
              ratingValue={summary.ratingValue}
              ratingCount={summary.ratingCount}
              nameFallback={config.nameFallback}
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {config.detailRows.map((row) => (
                <PublicProfileInfoRow
                  key={row.label}
                  icon={row.icon}
                  label={row.label}
                  value={row.getValue(data)}
                />
              ))}
            </div>



            {resolvedRole === "doctor" ? (
              <Card className="mt-6 rounded-2xl border-primary/20 p-4">
                <h3 className="text-base font-semibold">Availability</h3>
                {doctorAvailability?.hasSchedule ? (
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Working days:</span> {doctorAvailability.daysText}</p>
                    <p><span className="font-medium text-foreground">Working hours:</span> {doctorAvailability.hoursText}</p>
                  </div>
                ) : <p className="mt-2 text-sm text-muted-foreground">No schedule configured yet.</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={data?.onlineConsultation ? "default" : "secondary"}>{data?.onlineConsultation ? "Online Available" : "Online Unavailable"}</Badge>
                  <Badge variant={canBookDoctor ? "default" : "secondary"}>{canBookDoctor ? "In-person Available" : "In-person Unavailable"}</Badge>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Location / Clinic Address</p>
                  {data?.address ? <p>Doctor Address: {data.address}</p> : null}
                  {data?.clinicAddress && data?.clinicAddress !== data?.address ? <p>Clinic Address: {data.clinicAddress}</p> : null}
                  {!data?.address && !data?.clinicAddress ? <p>Not shared</p> : null}
                </div>
              </Card>
            ) : null}
            <PublicProfileTextSection title="About" value={bio} />
            {records.length ? <PublicProfileRecordsSection records={records} /> : null}
            {config.showProviderRatings ? <PublicProfileRatingsSection ratings={ratings} title={config.ratingsTitle} /> : null}
          </>
        )}
      </Card>
    </div>
  );
}
