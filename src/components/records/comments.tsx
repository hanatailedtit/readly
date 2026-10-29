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
  useEditSummaryCommentMutation,
} from "@/service/comment.service";
import type { SummaryCommentItemModel } from "@/model/comment/comment.model";
import { formatDate } from "@/lib/records";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommentComposer } from "./comment-composer";
import { DeleteDialog } from "./delete-dialog";
import { LoadError } from "./record-list";
export function Comments({ id }: { id: number }) {
  const query = useGetSummaryCommentListQuery(id),
    { data: user } = useGetUserMyInfoQuery(),
    create = useCreateSummaryCommentMutation(),
    edit = useEditSummaryCommentMutation(id),
    remove = useDeleteSummaryCommentMutation(id);
  const [text, setText] = useState(""),
    [replyId, setReplyId] = useState<number | null>(null),
    [replies, setReplies] = useState<Record<number, string>>({}),
    [deleteId, setDeleteId] = useState<number | null>(null),
    [editing, setEditing] = useState<{
      id: number;
      value: string;
      original: string;
    } | null>(null),
    [visible, setVisible] = useState(5);
  const saveEdit = async () => {
    const value = editing?.value.trim();
    if (
      !editing ||
      !value ||
      !user ||
      edit.isPending ||
      value === editing.original.trim()
    ) return;
    try {
      await edit.mutateAsync({ id: editing.id, comment: value });
      setEditing(null);
      toast.success("댓글을 수정했어요.");
    } catch {
      toast.error("댓글을 수정하지 못했어요. 다시 시도해 주세요.");
    }
  };
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
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={comment.userImage}
              alt={comment.userName}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="text-[10px]">
              {comment.userName?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/my-page/${comment.userId}`}
            className="text-sm font-semibold hover:underline"
          >
            {comment.userName}
          </Link>
        </div>
        {comment.isMy && user && (
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={editing !== null}
              onClick={() =>
                setEditing({
                  id: comment.id,
                  value: comment.comment,
                  original: comment.comment,
                })
              }
            >
              수정
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={editing !== null}
              onClick={() => setDeleteId(comment.id)}
              className="text-destructive"
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {formatDate(comment.createdAt)}
      </p>
      {editing?.id === comment.id && comment.isMy && user ? (
        <form
          className="space-y-3"
          aria-busy={edit.isPending}
          onSubmit={(event) => {
            event.preventDefault();
            void saveEdit();
          }}
        >
          <Label htmlFor={`edit-comment-${comment.id}`}>
            {reply ? "답글 수정" : "댓글 수정"}
          </Label>
          <Textarea
            id={`edit-comment-${comment.id}`}
            autoFocus
            rows={3}
            className="min-h-[112px] bg-background text-base leading-relaxed shadow-none md:text-base"
            value={editing.value}
            disabled={edit.isPending}
            onChange={(event) =>
              setEditing({ ...editing, value: event.target.value })
            }
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={edit.isPending}
              onClick={() => setEditing(null)}
            >
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={
                edit.isPending ||
                !editing.value.trim() ||
                editing.value.trim() === editing.original.trim()
              }
            >
              {edit.isPending ? "저장 중…" : "저장"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="whitespace-pre-wrap text-base leading-relaxed">
          {comment.comment}
        </p>
      )}
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
      <CommentComposer
        id="comment"
        user={user}
        value={text}
        onChange={setText}
        onSubmit={() => void submit(null)}
        pending={create.isPending}
        loginHref={`/login?next=${encodeURIComponent("/summary/detail/" + id)}`}
      />
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
              <div className="pl-4 sm:pl-8">
                <CommentComposer
                  id={`reply-${comment.id}`}
                  user={user}
                  value={replies[comment.id] || ""}
                  onChange={(value) =>
                    setReplies((r) => ({ ...r, [comment.id]: value }))
                  }
                  onSubmit={() => void submit(comment.id)}
                  pending={create.isPending}
                  loginHref={`/login?next=${encodeURIComponent("/summary/detail/" + id)}`}
                  replyTo={comment.userName}
                  onCancel={() => setReplyId(null)}
                />
              </div>
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
