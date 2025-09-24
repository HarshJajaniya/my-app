import type { UIMessage } from "@ai-sdk/react";
import { BotIcon, UserIcon } from "lucide-react";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <BotIcon className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}

      <div className={`max-w-[70%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-secondary text-secondary-foreground ml-auto"
              : "bg-card text-card-foreground border"
          }`}
        >
          <div className="text-pretty">
            {message.parts
              ?.filter(
                (part): part is { type: "text"; text: string } =>
                  part.type === "text"
              )
              .map((part) => part.text)
              .join("") || ""}
          </div>
        </div>
        {/* Optional timestamp: if you want, you can add Date.now() or remove */}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
