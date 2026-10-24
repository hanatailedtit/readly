"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
export function BookCover({
  title,
  image,
  className,
}: {
  title: string;
  image?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image]);
  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-sm border bg-muted",
        className,
      )}
    >
      {image && !failed ? (
        <Image
          src={image}
          alt={`${title} 표지`}
          fill
          unoptimized
          sizes="(min-width: 1024px) 180px, 120px"
          className="object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col justify-between p-2 text-muted-foreground">
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          <span className="line-clamp-3 text-xs font-medium">{title}</span>
        </div>
      )}
    </div>
  );
}
