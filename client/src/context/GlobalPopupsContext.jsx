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
          {profileTarget?.id ? (
            <PublicProfilePage profileId={profileTarget.id} profileRole={profileTarget.role} hideBack />
          ) : (
            <ProfilePage />
          )}
        </DialogContent>
      </Dialog>

      {chatOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-4">
          <div className="relative flex h-[78dvh] max-h-[640px] w-full max-w-[390px] overflow-hidden rounded-3xl bg-white shadow-2xl sm:max-w-[520px]">
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="absolute right-3 top-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-700 shadow-md hover:bg-slate-100"
              aria-label="Close chatbot"
            >
              ×
            </button>

            <div className="h-full min-h-0 w-full">
              <PatientChatbot popup onClose={() => setChatOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </GlobalPopupsContext.Provider>
  );
}

export function useGlobalPopups() {
  return useContext(GlobalPopupsContext);
}