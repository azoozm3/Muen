import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProfilePage from "@/pages/ProfilePage";
import PatientChatbot from "@/pages/PatientChatbot";
import PublicProfilePage from "@/features/profile/public/PublicProfilePage";

const GlobalPopupsContext = createContext(null);

export function GlobalPopupsProvider({ children }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTarget, setProfileTarget] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const openProfile = (target = null) => {
    setProfileTarget(target?.id ? target : null);
    setProfileOpen(true);
  };

  return (
    <GlobalPopupsContext.Provider value={{ openProfile, openChat: () => setChatOpen(true) }}>
      {children}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto border-0 p-0 shadow-2xl">
          {profileTarget?.id ? <PublicProfilePage profileId={profileTarget.id} profileRole={profileTarget.role} hideBack /> : <ProfilePage />}
        </DialogContent>
      </Dialog>
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="h-[min(760px,92vh)] max-w-2xl overflow-hidden border-0 bg-transparent p-0 shadow-2xl" hideCloseButton>
          <PatientChatbot popup onClose={() => setChatOpen(false)} />
        </DialogContent>
      </Dialog>
    </GlobalPopupsContext.Provider>
  );
}

export function useGlobalPopups() {
  return useContext(GlobalPopupsContext);
}
