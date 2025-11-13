"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthWrapper from "@/components/AuthWrapper";
import AccountButton from "@/components/AccountButton";
// import ThemeToggleButton from "@/components/ThemeToggleButton";

import {
  PlusIcon,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
  MenuIcon,
} from "lucide-react";

type Role = "user" | "assistant" | "system";

interface ChatMessage {
  role: Role;
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find((s) => s.id === currentSessionId);
      if (session) setMessages(session.messages);
    }
  }, [currentSessionId, sessions]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat ${sessions.length + 1}`,
      messages: [],
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  const handleSelectChat = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSidebarOpen(false); // close sidebar on mobile
  };

  const uploadFileToCloudinary = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    setUploading(false);

    if (!data.secure_url) throw new Error("File upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !uploading) || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage.content }),
      });
      const data = await res.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "No response",
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId ? { ...s, messages: updatedMessages } : s
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Error: Failed to get a response." },
      ]);
    }

    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileUrl = await uploadFileToCloudinary(file);

      const userMessage: ChatMessage = {
        role: "user",
        content: `📎 File: ${fileUrl}`,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      setLoading(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fileUrl }),
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "No response",
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId ? { ...s, messages: updatedMessages } : s
        )
      );
    } catch (err) {
      console.error("File upload failed:", err);
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "Error: File upload failed." },
      ]);
    }
    setLoading(false);
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col h-screen bg-[#202123] text-white">
        <div className="flex flex-col h-screen bg-[#202123] text-white">
          {/* Navbar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-[#343541] border-b border-gray-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="sm:hidden"
              >
                <MenuIcon className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-base sm:text-lg font-bold">ChatGPT Clone</h1>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base">
              Share
            </Button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div
              className={`fixed sm:static top-0 left-0 h-full w-64 bg-[#202123] border-r border-gray-800 transform sm:transform-none transition-transform duration-200 z-20 ${
                sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full sm:translate-x-0"
              }`}
            >
              <div className="p-4 border-b border-gray-800">
                <Button
                  onClick={handleNewChat}
                  className="w-full bg-[#343541] hover:bg-[#444654] flex items-center gap-2 px-4 py-2 rounded"
                >
                  <PlusIcon className="w-4 h-4" />
                  New Chat
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSelectChat(session.id)}
                    className={`w-full text-left p-3 rounded hover:bg-[#343541] transition-colors ${
                      currentSessionId === session.id ? "bg-[#343541]" : ""
                    }`}
                  >
                    <MessageSquareIcon className="inline-block w-4 h-4 mr-2" />
                    {session.title}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-800 space-y-2">
                {/* <ThemeToggleButton /> */}
                <AccountButton />
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col gap-3 sm:gap-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-lg whitespace-pre-wrap text-sm sm:text-base ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-[#343541] text-white"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-lg bg-[#343541] text-white">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSubmit}
                className="p-3 sm:p-4 border-t border-gray-800 bg-[#343541] flex items-center gap-2"
              >
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center justify-center w-9 sm:w-10 h-9 sm:h-10 bg-[#444654] rounded-full hover:bg-[#55585e]"
                >
                  <PlusIcon className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading || uploading}
                />

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send a message..."
                  disabled={loading}
                  className="flex-1 rounded-full bg-[#40414f] border-none text-white placeholder-gray-400 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base"
                />

                <Button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-blue-500 hover:bg-blue-600 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
