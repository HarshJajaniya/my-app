import { NextRequest, NextResponse } from "next/server";
import MemoryClient from "mem0ai";

const memory = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY ?? "",
});

interface MemoryItem {
  metadata?: {
    role?: string;
    conversationId?: string;
  };
  memory?: string;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId") ?? "default";

    const memories = await memory.search(conversationId, {
      user_id: "alex",
      limit: 50,
    });

    const formatted = memories.map((m: MemoryItem) => ({
      role: m.metadata?.role ?? "user",
      content: m.memory ?? "",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Memories API error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
