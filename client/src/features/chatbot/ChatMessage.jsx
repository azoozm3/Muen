import { Bot, User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }) {
  const isBot = message.role === "bot";
  const highUrgency = message.urgency === "high";

  return (
    <div className={cn("flex w-full", isBot ? "justify-start" : "justify-end")}>
      <div className={cn("flex max-w-[88%] gap-2.5 sm:max-w-[82%]", isBot ? "flex-row" : "flex-row-reverse")}>
        <div className={cn("mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm", isBot ? "bg-white text-primary ring-1 ring-primary/15" : "bg-slate-900 text-white")}>
          {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-line",
            isBot ? "rounded-tl-md border border-slate-200 bg-white text-slate-800" : "rounded-tr-md bg-primary text-primary-foreground",
            highUrgency && "border-red-200 bg-red-50 text-red-700",
          )}
        >
          {highUrgency ? <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide"><AlertTriangle className="h-3.5 w-3.5" /> Urgent</div> : null}
          {message.text}
        </div>
      </div>
    </div>
  );
}
