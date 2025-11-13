"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserIcon, LogOutIcon } from "lucide-react";

export default function AccountButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button
        disabled
        className="w-full bg-[#343541] opacity-70 hover:bg-[#444654] flex items-center gap-2 px-4 py-2 rounded"
      >
        Loading...
      </Button>
    );
  }

  if (!session) {
    // 🧠 User not logged in → show “Login”
    return (
      <Button
        onClick={() => signIn("github", { callbackUrl: "/chat" })}
        className="w-full bg-[#343541] hover:bg-[#444654] flex items-center gap-2 px-4 py-2 rounded"
      >
        <UserIcon className="w-4 h-4" />
        Login
      </Button>
    );
  }

  // 🧠 User logged in → show “Logout”
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full bg-[#343541] hover:bg-[#444654] flex items-center gap-2 px-4 py-2 rounded"
    >
      <LogOutIcon className="w-4 h-4" />
      Logout
    </Button>
  );
}
