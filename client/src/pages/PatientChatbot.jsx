import { useLocation } from "wouter";
import { ChatbotPageView } from "@/features/chatbot/page/ChatbotPageView";
import { useChatbotConversation } from "@/features/chatbot/page/useChatbotConversation";

export default function PatientChatbot({ popup = false, onClose }) {
  const [, navigate] = useLocation();
  const chatbot = useChatbotConversation();

  return (
    <ChatbotPageView
      popup={popup}
      inputValue={chatbot.inputValue}
      listRef={chatbot.listRef}
      messages={chatbot.messages}
      starterPrompts={chatbot.starterPrompts}
      onSendMessage={chatbot.sendMessage}
      onChangeInput={chatbot.setInputValue}
      onBack={() => (popup ? onClose?.() : navigate("/dashboard/patient"))}
      onOpenEmergency={() => navigate("/dashboard/patient/emergency")}
      onOpenServices={() => navigate("/dashboard/patient/services")}
    />
  );
}
