"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
export function DeleteDialog({
  open,
  onOpenChange,
  onDelete,
  pending = false,
  title = "기록을 삭제할까요?",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  pending?: boolean;
  title?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>삭제한 내용은 되돌릴 수 없어요.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={onDelete}
          >
            {pending ? "삭제 중…" : "삭제하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
