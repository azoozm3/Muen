import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, CalendarDays, CheckCircle, Clock, MapPin, Star, Stethoscope, Video, XCircle } from "lucide-react";
import { ProfileLink } from "@/components/common/ProfileLink";
import { getScheduleSummary, isDoctorBookable } from "@/lib/doctorAvailability";

export default function DoctorDirectoryCard({ doctor, index, onBook }) {
  const schedule = getScheduleSummary(doctor);
  const isAvailable = isDoctorBookable(doctor);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
      <Card className="flex h-full flex-col p-5" data-testid={`card-doctor-${doctor.id}`}>
        <div className="mb-3 flex items-start gap-3">
          {doctor.profileImage ? (
            <img
              src={doctor.profileImage}
              alt={doctor.name || "Doctor"}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Stethoscope className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-semibold" data-testid={`text-doctor-name-${doctor.id}`}><ProfileLink id={doctor.id} role="doctor" className="font-semibold text-foreground hover:text-primary">{doctor.name}</ProfileLink></h3>
              <ProfileLink id={doctor.id} role="doctor" className="text-xs text-primary underline-offset-4 hover:underline">Profile</ProfileLink>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {doctor.specialty ? <Badge variant="secondary">{doctor.specialty}</Badge> : null}
              {doctor.onlineConsultation ? <Badge className="gap-1"><Video className="h-3 w-3" />Online</Badge> : null}
            </div>
          </div>
        </div>

        <div className="mb-2 flex items-center gap-1">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-3.5 w-3.5 ${Number(doctor.rating || 0) >= star ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`} />)}<span className="ml-1 text-xs text-muted-foreground">{doctor.rating ? Number(doctor.rating).toFixed(1) : "New"}</span></div>
        {doctor.bio ? <p className="mb-3 flex-1 line-clamp-3 text-sm text-muted-foreground">{doctor.bio}</p> : <div className="flex-1" />}
        <div className="mb-3 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">{isAvailable ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-muted-foreground" />}<span className="font-medium">{isAvailable ? "Available" : "Unavailable"}</span></div>
          <div className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 shrink-0" /><span className="line-clamp-1">{schedule.daysText}</span></div>
          {schedule.hoursText ? <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 shrink-0" /><span>{schedule.hoursText}</span></div> : null}
          {doctor.address || doctor.clinicAddress ? <div className="flex items-start gap-1"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /><div><p className="font-medium text-foreground/80">Location / Clinic Address</p>{doctor.address ? <p>Doctor Address: {doctor.address}</p> : null}{doctor.clinicAddress && doctor.clinicAddress !== doctor.address ? <p>Clinic Address: {doctor.clinicAddress}</p> : null}</div></div> : null}
        </div>
        <Button className="mt-auto w-full" onClick={() => onBook(doctor)} disabled={!isAvailable} data-testid={`button-book-${doctor.id}`}><Calendar className="mr-1 h-4 w-4" />{isAvailable ? "Book Appointment" : "Unavailable for booking"}</Button>
      </Card>
    </motion.div>
  );
}
