"use client";
import Link from "next/link";
import { useState } from "react";
import { CornerDownRight } from "lucide-react";
import { toast } from "sonner";
import { useGetUserMyInfoQuery } from "@/service/user.service";
import {
  useGetSummaryCommentListQuery,
  useCreateSummaryCommentMutation,
  useDeleteSummaryCommentMutation,
} from "@/service/comment.service";
import type { SummaryCommentItemModel } from "@/model/comment/comment.model";
import { formatDate } from "@/lib/records";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DeleteDialog } from "./delete-dialog";
import { LoadError } from "./record-list";
export function Comments({ id }: { id: number }) {
  const query = useGetSummaryCommentListQuery(id),
    { data: user } = useGetUserMyInfoQuery(),
    create = useCreateSummaryCommentMutation(),
    remove = useDeleteSummaryCommentMutation(id);
  const [text, setText] = useState(""),
    [replyId, setReplyId] = useState<number | null>(null),
    [replies, setReplies] = useState<Record<number, string>>({}),
    [deleteId, setDeleteId] = useState<number | null>(null),
    [visible, setVisible] = useState(5);
  const submit = async (commentId: number | null) => {
    const value = (commentId === null ? text : replies[commentId] || "").trim();
    if (!value || !user) return;
    try {
      await create.mutateAsync({
        summary_id: id,
        comment_id: commentId,
        comment: value,
      });
      if (commentId === null) setText("");
      else {
        setReplies((r) => ({ ...r, [commentId]: "" }));
        setReplyId(null);
      }
      toast.success(
        commentId === null ? "댓글을 남겼어요." : "답글을 남겼어요.",
      );
    } catch {
      toast.error("댓글을 저장하지 못했어요. 다시 시도해 주세요.");
    }
  };
  const item = (comment: SummaryCommentItemModel, reply = false) => (
    <div
      className={
        reply
          ? "space-y-2 rounded-sm bg-muted p-4"
          : "space-y-3 rounded-sm border p-4"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/my-page/${comment.userId}`}
          className="text-sm font-semibold hover:underline"
        >
          {comment.userName}
        </Link>
        {comment.isMy && user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(comment.id)}
            className="text-destructive"
          >
            삭제
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {formatDate(comment.createdAt)}
      </p>
      <p className="whitespace-pre-wrap text-base leading-relaxed">
        {comment.comment}
      </p>
      {!reply && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReplyId(replyId === comment.id ? null : comment.id)}
        >
          답글 달기
        </Button>
      )}
    </div>
  );
  return (
    <section className="space-y-6 border-t pt-8">
      <h2 className="section-title">댓글 {query.data?.total || 0}</h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(null);
        }}
      >
        <Label htmlFor="comment">댓글 남기기</Label>
        <Textarea
          id="comment"
          value={text}
          disabled={!user || create.isPending}
          onChange={(e) => setText(e.target.value)}
          placeholder="기록에 대한 생각을 나눠보세요."
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {user
              ? "서로의 생각을 존중하며 이야기해 주세요."
              : "댓글 작성은 로그인 후 가능합니다."}
          </p>
          {user ? (
            <Button type="submit" disabled={!text.trim() || create.isPending}>
              댓글 남기기
            </Button>
          ) : (
            <Button asChild>
              <Link
                href={`/login?next=${encodeURIComponent("/summary/detail/" + id)}`}
              >
                로그인 후 댓글 남기기
              </Link>
            </Button>
          )}
        </div>
      </form>
      {query.isError ? (
        <LoadError retry={query.refetch} />
      ) : (
        query.data?.list.slice(0, visible).map((comment) => (
          <div key={comment.id} className="space-y-4">
            {item(comment)}
            {comment.reply?.map((reply) => (
              <div key={reply.id} className="flex gap-3 pl-1 sm:pl-6">
                <CornerDownRight
                  className="mt-3 h-5 w-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">{item(reply, true)}</div>
              </div>
            ))}
            {replyId === comment.id && (
              <form
                className="space-y-3 rounded-sm bg-muted p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit(comment.id);
                }}
              >
                <Label htmlFor={`reply-${comment.id}`}>
                  {comment.userName} 님에게 답글
                </Label>
                <Textarea
                  id={`reply-${comment.id}`}
                  value={replies[comment.id] || ""}
                  disabled={!user || create.isPending}
                  onChange={(e) =>
                    setReplies((r) => ({ ...r, [comment.id]: e.target.value }))
                  }
                  placeholder="답글을 입력하세요."
                />
                {user ? (
                  <Button
                    type="submit"
                    disabled={!replies[comment.id]?.trim() || create.isPending}
                  >
                    답글 남기기
                  </Button>
                ) : (
                  <Button asChild>
                    <Link
                      href={`/login?next=${encodeURIComponent("/summary/detail/" + id)}`}
                    >
                      로그인 후 답글 남기기
                    </Link>
                  </Button>
                )}
              </form>
            )}
          </div>
        ))
      )}
      {(query.data?.list.length || 0) > visible && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setVisible((n) => n + 5)}
        >
          댓글 더 보기
        </Button>
      )}
      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="댓글을 삭제할까요?"
        pending={remove.isPending}
        onDelete={async () => {
          if (deleteId === null) return;
          try {
            await remove.mutateAsync(deleteId);
            setDeleteId(null);
            toast.success("댓글을 삭제했어요.");
          } catch {
            toast.error("댓글을 삭제하지 못했어요. 다시 시도해 주세요.");
          }
        }}
      />
    </section>
  );
}
