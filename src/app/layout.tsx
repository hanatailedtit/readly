import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import Provider from "./provider";
import KaKaoScript from "./script/KaKaoScript";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
const pretendard = localFont({
  src: [
    { path: "../../public/fonts/Pretendard-Regular.otf", weight: "400" },
    { path: "../../public/fonts/Pretendard-SemiBold.otf", weight: "500 600" },
    { path: "../../public/fonts/Pretendard-Bold.otf", weight: "700" },
  ],
  variable: "--font-pretendard",
  display: "swap",
});
const gowun = localFont({
  src: "../../public/fonts/GowunBatang-Bold.ttf",
  weight: "700",
  variable: "--font-gowun",
  display: "swap",
});
export const metadata: Metadata = {
  title: { default: "Readly · 읽고 남은 마음", template: "%s · Readly" },
  description:
    "책을 덮은 뒤에도 이어지는 이야기. 읽은 책의 생각을 기록하고 나눠보세요.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} ${gowun.variable}`}>
        <Provider>
          <div className="flex min-h-dvh flex-col">
            <a
              href="#main"
              className="sr-only z-50 bg-white p-4 focus:not-sr-only focus:absolute"
            >
              본문 바로가기
            </a>
            <SiteHeader />
            <main id="main" className="page-container flex-1">
              <Suspense>{children}</Suspense>
            </main>
            <SiteFooter />
          </div>
          <KaKaoScript />
          <Toaster richColors position="bottom-center" />
        </Provider>
      </body>
    </html>
  );
}
