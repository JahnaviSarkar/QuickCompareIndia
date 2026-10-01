"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
      {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      <span className="hidden sm:inline">{copied ? "Copied" : "Copy link"}</span>
    </Button>
  );
}
