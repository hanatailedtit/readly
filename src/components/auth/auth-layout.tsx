import Image from "next/image";
import type { ReactNode } from "react";
export function AuthLayout({
  children,
  signup = false,
}: {
  children: ReactNode;
  signup?: boolean;
}) {
  return (
    <div className="grid gap-16 py-4 lg:grid-cols-[1fr_432px] lg:items-center lg:gap-32 lg:px-10 lg:py-10">
      <aside className="hidden space-y-8 lg:block">
        <h2 className="font-display text-[34px] font-bold leading-relaxed">
          {signup ? (
            <>
              다 읽은 책도,
              <br />
              다시 시작되는 이야기.
            </>
          ) : (
            <>
              책을 덮은 뒤에,
              <br />
              우리의 이야기가 시작돼요.
            </>
          )}
        </h2>
        <Image
          src="/brand/reading-illustration.svg"
          width={397}
          height={236}
          className="h-auto w-full max-w-[480px]"
          alt="펼친 책 속에 남겨진 독서 기록"
        />
        <p className="text-muted-foreground">
          읽은 마음을 오래 간직하는 나만의 기록.
        </p>
      </aside>
      <div className="mx-auto w-full max-w-[432px]">{children}</div>
    </div>
  );
}
