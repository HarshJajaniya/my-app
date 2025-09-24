import { UIMessage } from "@ai-sdk/react";
import { MessageBubble } from "@/components/message-bubble";
import { LoadingMessage } from "@/components/loading-message";

interface ChatAreaProps {
  messages: UIMessage[]; // Use UIMessage instead of Message
  isLoading?: boolean;
}

export function ChatArea({ messages, isLoading = false }: ChatAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <LoadingMessage />}
      </div>
    </div>
  );
}
