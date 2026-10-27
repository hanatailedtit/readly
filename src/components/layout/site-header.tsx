"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUserMyInfoQuery } from "@/service/user.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  MY_USERS_QUERY_KEY,
  isSessionQuery,
} from "@/constants/query-key.constants";
export function BrandLogo() {
  return (
    <Image
      src="/brand/readly-logo.svg"
      width={120}
      height={40}
      alt="Readly"
      priority
      className="h-10 w-[108px] shrink-0 sm:w-[120px]"
    />
  );
}
export function SiteHeader() {
  const path = usePathname(),
    { data: user } = useGetUserMyInfoQuery(),
    client = useQueryClient();
  const nav = (
    <>
      {[
        ["/records", "독서 기록"],
        ["/books", "도서"],
      ].map(([href, label]) => (
        <Link
          key={href}
          href={href!}
          aria-current={
            path.startsWith(href!) ||
            (href === "/records" && path.startsWith("/summary"))
              ? "page"
              : undefined
          }
          className={cn(
            "flex min-h-11 items-center justify-center px-4 text-sm font-semibold text-muted-foreground hover:text-primary",
            (path.startsWith(href!) ||
              (href === "/records" && path.startsWith("/summary"))) &&
              "text-primary",
          )}
        >
          {label}
        </Link>
      ))}
    </>
  );
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-[1264px] flex-wrap items-center justify-between gap-x-3 px-4 py-3 sm:px-8 sm:py-[18px]">
        <Link href="/" aria-label="Readly 홈">
          <BrandLogo />
        </Link>
        <nav
          aria-label="주 메뉴"
          className="hidden flex-1 gap-4 pl-[136px] lg:flex"
        >
          {nav}
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={user.profile_image}
                      alt={user.nickname}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="text-xs">
                      {user.nickname?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-24 truncate">{user.nickname}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/my-page/${user.id}`}>내 독서 기록</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={async () => {
                    Cookies.remove("access_token");
                    await client.cancelQueries({
                      predicate: isSessionQuery,
                    });
                    client.setQueryData([MY_USERS_QUERY_KEY], null);
                    void client.invalidateQueries({
                      predicate: (query) =>
                        query.queryKey[0] !== MY_USERS_QUERY_KEY &&
                        query.queryKey[1] !== "recent" &&
                        isSessionQuery(query),
                    });
                  }}
                >
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="ghost"
              className="order-2 px-2 sm:order-none sm:px-4"
            >
              <Link href="/login">로그인</Link>
            </Button>
          )}
          <Button asChild className="px-3 sm:min-w-[168px]">
            <Link href="/summary/create">
              <span className="sm:hidden">기록 쓰기</span>
              <span className="hidden sm:inline">기록 남기기</span>
            </Link>
          </Button>
        </div>
        <nav
          aria-label="모바일 주 메뉴"
          className="mt-2 flex w-full justify-around lg:hidden"
        >
          {nav}
        </nav>
      </div>
    </header>
  );
}
