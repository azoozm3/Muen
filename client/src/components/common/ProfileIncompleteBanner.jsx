import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ProfileIncompleteBanner() {
  return (
    <Alert variant="destructive" className="rounded-2xl">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Please complete your profile so the admin can review and approve your account.{" "}
        <a href="/profile" className="font-semibold underline">
          Go to Profile →
        </a>
      </AlertDescription>
    </Alert>
  );
}
