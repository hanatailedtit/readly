'use client';

import '@/styles/editor.scss';
import { useEffect, useRef } from 'react';

type BookSummaryContentProps = {
  content: string;
};

export default function BookSummaryContent({
  content,
}: BookSummaryContentProps) {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!divRef.current) return;
    divRef.current.innerHTML = content;
  }, [content]);

  return <div ref={divRef} className="w-full"></div>;
}
