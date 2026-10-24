import Link from "next/link";
import Image from "next/image";
import { safeExternalUrl } from "@/lib/records";
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-muted">
      <div className="mx-auto flex max-w-[1264px] flex-col gap-4 px-4 py-8 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label="Readly 홈">
            <Image
              src="/brand/readly-logo.svg"
              width={120}
              height={40}
              alt="Readly"
            />
          </Link>
          <nav
            className="flex flex-wrap gap-5 text-sm text-muted-foreground"
            aria-label="서비스 안내"
          >
            <Link href="/#about">서비스 소개</Link>
            {safeExternalUrl(process.env.NEXT_PUBLIC_TERMS_URL || "") && (
              <a
                href={process.env.NEXT_PUBLIC_TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                이용약관
              </a>
            )}
            {safeExternalUrl(process.env.NEXT_PUBLIC_PRIVACY_URL || "") && (
              <a
                href={process.env.NEXT_PUBLIC_PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보처리방침
              </a>
            )}
          </nav>
        </div>
        <p className="text-sm text-muted-foreground">
          읽고, 기록하고, 나누다. 책을 덮은 뒤에도 이어지는 이야기.
        </p>
      </div>
    </footer>
  );
}
