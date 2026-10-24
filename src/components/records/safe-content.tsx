"use client";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
export function SafeContent({ content }: { content: string }) {
  const [safe, setSafe] = useState("");
  useEffect(() => {
    setSafe(
      DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["form", "input", "button", "textarea", "select", "style"],
      }),
    );
  }, [content]);
  return (
    <div className="rich-content" dangerouslySetInnerHTML={{ __html: safe }} />
  );
}
