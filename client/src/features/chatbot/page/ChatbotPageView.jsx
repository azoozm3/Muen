import { motion } from "framer-motion";
import { ArrowLeft, Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/features/chatbot/ChatMessage";
import { cn } from "@/lib/utils";

export function ChatbotPageView({
  popup = false,
  inputValue,
  listRef,
  messages,
  onBack,
  onChangeInput,
  onOpenEmergency,
  onOpenServices,
  onSendMessage,
  starterPrompts,
}) {
  return (
    <div className={cn("flex flex-col", popup ? "h-full bg-transparent" : "min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8")}>
      <div className={cn("mx-auto flex w-full flex-1 flex-col", popup ? "h-full max-w-none" : "max-w-4xl gap-4")}>
        {!popup ? (
          <div>
            <Button variant="ghost" onClick={onBack} data-testid="button-back-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        ) : null}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-0 flex-1">
          <Card className={cn("flex min-h-0 flex-1 flex-col overflow-hidden border-primary/10 shadow-xl", popup ? "rounded-3xl" : "min-h-[70vh] rounded-3xl")}>
            <div className="relative overflow-hidden border-b bg-gradient-to-r from-primary/15 via-sky-50 to-white px-5 py-4">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h1 className="truncate text-lg font-semibold">Medical Chat</h1>
                      <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-primary ring-1 ring-primary/10">
                        <Sparkles className="mr-1 h-3 w-3" /> Help
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-500">Ask about symptoms, medicine, appointments, or urgent signs.</p>
                  </div>
                </div>
                {popup ? (
                  <Button type="button" variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 shrink-0 rounded-full bg-white/70 hover:bg-white" title="Close chat">
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            {Array.isArray(starterPrompts) && starterPrompts.length ? (
              <div className="flex gap-2 overflow-x-auto border-b bg-white px-4 py-3">
                {starterPrompts.slice(0, popup ? 3 : 5).map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => onSendMessage(prompt)}
                    className="shrink-0 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4">
              {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
            </div>

            <div className="border-t bg-white p-3 sm:p-4">
              <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm">
                <Input
                  placeholder="Ask directly..."
                  value={inputValue}
                  onChange={(event) => onChangeInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onSendMessage();
                    }
                  }}
                  data-testid="input-chatbot"
                  className="min-h-11 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button onClick={() => onSendMessage()} data-testid="button-chatbot-send" className="min-h-11 rounded-xl px-3 sm:px-4">
                  <Send className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Send</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
