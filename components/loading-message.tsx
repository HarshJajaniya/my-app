import { BotIcon } from "lucide-react";

export function LoadingMessage() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
        <BotIcon className="w-4 h-4 text-secondary-foreground" />
      </div>

      <div className="max-w-[70%]">
        <div className="bg-card text-card-foreground border rounded-lg px-4 py-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
