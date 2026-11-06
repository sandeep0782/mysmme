"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareButton({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-lg bg-pink-50 px-4 py-2.5 text-sm font-semibold text-[#ff3f6c] hover:bg-pink-100"
    >
      {copied ? <Check size={17} /> : <Share2 size={17} />}
      {copied ? "Link Copied" : "Share Article"}
    </button>
  );
}
