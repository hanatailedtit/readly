"use client";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function ShareMenu({
  title,
  likeCount,
  viewCount,
  userName,
  userImage,
}: {
  title: string;
  likeCount: number;
  viewCount: number;
  userName: string;
  userImage: string;
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("링크를 복사했어요.");
    } catch {
      toast.error("복사하지 못했어요. 주소창의 링크를 복사해 주세요.");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Share2 />
          공유
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => void copy()}>
          링크 복사
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            const query = new URLSearchParams({
              text: title,
              url: window.location.href,
            });
            window.open(
              `https://twitter.com/intent/tweet?${query}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
        >
          X에 공유
        </DropdownMenuItem>
        {process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY && (
          <DropdownMenuItem
            onSelect={() => {
              if (!window.Kakao?.isInitialized()) {
                toast.error(
                  "공유 기능을 준비 중이에요. 잠시 후 다시 시도해 주세요.",
                );
                return;
              }
              try {
                window.Kakao.Share.sendScrap({
                  requestUrl: window.location.href,
                  templateId: 114283,
                  templateArgs: {
                    title,
                    like_count: likeCount,
                    view_count: viewCount,
                    path: window.location.pathname,
                    profile_image: userImage,
                    user_name: userName,
                  },
                });
              } catch {
                toast.error(
                  "카카오톡 공유를 열지 못했어요. 다시 시도해 주세요.",
                );
              }
            }}
          >
            카카오톡에 공유
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
