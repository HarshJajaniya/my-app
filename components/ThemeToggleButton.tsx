"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-full bg-[#343541] hover:bg-[#444654] flex items-center gap-2 px-4 py-2 rounded"
    >
      {isDark ? (
        <>
          <SunIcon className="w-4 h-4" />
          Light Mode
        </>
      ) : (
        <>
          <MoonIcon className="w-4 h-4" />
          Dark Mode
        </>
      )}
    </Button>
  );
}
