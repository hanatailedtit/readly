"use client";

import Script from "next/script";

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendScrap: (options: {
          requestUrl: string;
          templateId: number;
          templateArgs: Record<string, string | number | undefined>;
        }) => void;
      };
    };
  }
}

export default function KaKaoScript() {
  const onLoad = () => {
    if (window.Kakao && !window.Kakao.isInitialized())
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY!);
  };

  if (!process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY) return null;

  return (
    <Script
      src="https://developers.kakao.com/sdk/js/kakao.js"
      strategy="lazyOnload"
      onLoad={onLoad}
    />
  );
}
