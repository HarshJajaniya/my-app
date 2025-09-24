import { NextResponse } from "next/server";
import MemoryClient from "mem0ai";

const memory = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY ?? "",
});

interface ConversationMemory {
  metadata?: {
    role?: string;
    conversationId?: string;
  };
  memory?: string;
}

export async function GET() {
  try {
    const conversations = await memory.search("conversation_list", {
      user_id: "alex",
      limit: 50,
    });

    const formatted = conversations.map((m: ConversationMemory) => ({
      role: m.metadata?.role ?? "user",
      conversationId: m.metadata?.conversationId ?? "default",
      content: m.memory ?? "",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Conversation API error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
