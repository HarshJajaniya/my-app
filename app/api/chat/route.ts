import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import MemoryClient from "mem0ai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

// Initialize MemoryClient
const memory = new MemoryClient({
  apiKey: process.env.MEM0_API_KEY ?? "",
});

type ChatRole = "user" | "assistant" | "system";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatPart {
  type: "text" | "image";
  text?: string;
  image_url?: string;
}

interface ChatBodyMessage {
  parts?: ChatPart[];
  content?: string;
}

interface ChatRequestBody {
  conversationId?: string;
  isNewConversation?: boolean;
  messages?: ChatBodyMessage[];
  text?: string;
}

const USER_ID = "alex";

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();

    const conversationId = body.conversationId ?? "default";
    const isNewConversation = Boolean(body.isNewConversation);

    let userMessage = "";
    let imageUrl = "";

    // Extract last message
    if (Array.isArray(body.messages) && body.messages.length > 0) {
      const lastMessage = body.messages[body.messages.length - 1];

      if (Array.isArray(lastMessage.parts)) {
        const parts = lastMessage.parts;

        const textPart = parts.find(
          (p): p is ChatPart => p.type === "text" && typeof p.text === "string"
        );
        if (textPart?.text) {
          userMessage = textPart.text.trim();
        }

        const imagePart = parts.find(
          (p): p is ChatPart => p.type === "image" && typeof p.image_url === "string"
        );
        if (imagePart?.image_url) {
          imageUrl = imagePart.image_url.trim();
        }
      } else if (typeof lastMessage.content === "string") {
        userMessage = lastMessage.content.trim();
      }
    } else if (typeof body.text === "string") {
      userMessage = body.text.trim();
    }

    if (!userMessage && !imageUrl) {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    console.log("📝 Extracted message:", userMessage);
    console.log("🖼️ Extracted image URL:", imageUrl);

    if (imageUrl) {
      userMessage += `\n\n[Image URL](${imageUrl})`;
    }

    // Load previous conversation history
    let historyMessages: ChatMessage[] = [];

    if (!isNewConversation) {
      const previousMemories =
        (await memory.search(conversationId, {
          user_id: USER_ID,
          limit: 20,
        })) ?? [];

      historyMessages = previousMemories
        .map((m) => ({
          role: (m.metadata?.role as ChatRole) ?? "user",
          content: m.memory ?? "",
        }))
        .filter((m) => m.content.trim() !== "");
    }

    const messages: ChatMessage[] = [
      ...historyMessages,
      { role: "user", content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const assistantText =
      completion.choices?.[0]?.message?.content?.trim() ?? "";

    // Store user message
    await memory.add([{ role: "user", content: userMessage }], {
      user_id: USER_ID,
      metadata: { role: "user", conversationId },
    });

    // Store assistant message
    await memory.add([{ role: "assistant", content: assistantText }], {
      user_id: USER_ID,
      metadata: { role: "assistant", conversationId },
    });

    return NextResponse.json({
      id: completion.id,
      object: completion.object,
      created: completion.created,
      model: completion.model,
      choices: completion.choices,
      conversationId,
    });
  } catch (err) {
    console.error("API error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
