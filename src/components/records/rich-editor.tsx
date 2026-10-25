"use client";
import { useState, memo } from "react";
import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import ImageExtension from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeExternalUrl } from "@/lib/records";
export const RichEditor = memo(function RichEditor({
  value,
  onChange,
  invalid = false,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [url, setUrl] = useState(""),
    [error, setError] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      ImageExtension.configure({ inline: true, allowBase64: true }),
      TableKit,
      TextStyleKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({
        openOnClick: false,
        protocols: ["http", "https"],
      }),
    ],
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "rich-content min-h-[300px] p-5 outline-none sm:min-h-[350px] sm:p-6",
        "aria-label": "독서 기록 본문",
        "aria-invalid": String(invalid),
      },
    },
  });
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      characters: editor?.getText().length || 0,
      bold: editor?.isActive("bold") || false,
      italic: editor?.isActive("italic") || false,
      blockquote: editor?.isActive("blockquote") || false,
      bulletList: editor?.isActive("bulletList") || false,
      heading: editor?.isActive("heading") || false,
    }),
  });
  return (
    <div
      className="overflow-hidden rounded-sm border"
      data-invalid={invalid || undefined}
    >
      <div className="flex flex-wrap items-center gap-1 bg-muted p-3">
        <Select
          value={state?.heading ? "heading" : "body"}
          onValueChange={(v) => {
            if (v === "body") editor?.chain().focus().setParagraph().run();
            else editor?.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <SelectTrigger aria-label="본문 서식" className="w-[110px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="body">본문</SelectItem>
            <SelectItem value="heading">제목</SelectItem>
          </SelectContent>
        </Select>
        {[
          [
            "굵게",
            state?.bold,
            () => editor?.chain().focus().toggleBold().run(),
          ],
          [
            "기울임",
            state?.italic,
            () => editor?.chain().focus().toggleItalic().run(),
          ],
          [
            "인용",
            state?.blockquote,
            () => editor?.chain().focus().toggleBlockquote().run(),
          ],
          [
            "목록",
            state?.bulletList,
            () => editor?.chain().focus().toggleBulletList().run(),
          ],
        ].map(([label, active, action]) => (
          <Button
            key={String(label)}
            type="button"
            variant={active ? "secondary" : "ghost"}
            aria-pressed={!!active}
            disabled={!editor}
            onClick={() => {
              if (typeof action === "function") action();
            }}
          >
            {String(label)}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          disabled={!editor}
          onClick={() => {
            setUrl(String(editor?.getAttributes("link").href || ""));
            setError("");
            setOpen(true);
          }}
        >
          링크
        </Button>
      </div>
      <EditorContent editor={editor} />
      <div className="flex justify-between bg-muted p-3 text-xs text-muted-foreground">
        <span>{state?.characters || 0}자</span>
        <span>서식 있는 본문 작성</span>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>링크 넣기</DialogTitle>
            <DialogDescription>
              연결할 웹페이지 주소를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="editor-url">웹페이지 주소</Label>
          <Input
            id="editor-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
          />
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                editor?.chain().focus().unsetLink().run();
                setOpen(false);
              }}
            >
              링크 해제
            </Button>
            <Button
              type="button"
              onClick={() => {
                const safe = safeExternalUrl(url);
                if (!safe) {
                  setError("http 또는 https로 시작하는 주소를 입력해 주세요.");
                  return;
                }
                editor?.chain().focus().setLink({ href: safe }).run();
                setOpen(false);
              }}
            >
              적용
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
