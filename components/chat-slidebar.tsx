"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

interface ChatSidebarProps {
  onNewChat: () => void;
  onSelectChat: (conversationId: string) => void;
}

interface Conversation {
  id: string;
  title: string;
}

export function ChatSidebar({ onNewChat, onSelectChat }: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Fetch conversations from backend
    async function fetchConversations() {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    }
    fetchConversations();
  }, []);

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={onNewChat}
          className="w-full bg-sidebar-primary hover:bg-sidebar-accent text-sidebar-primary-foreground"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="w-full text-left p-3 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center"
            >
              <MessageSquareIcon className="w-4 h-4 inline mr-2" />
              {chat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button className="w-full text-left p-3 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center">
          <SettingsIcon className="w-4 h-4 mr-2" />
          Settings
        </button>
        <button className="w-full text-left p-3 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center">
          <UserIcon className="w-4 h-4 mr-2" />
          Profile
        </button>
      </div>
    </div>
  );
}
