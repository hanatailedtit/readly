import type { BookSummaryItemModel } from "@/model/book/book.model";
import { bookFromRecord, plainText, recordBookKey } from "@/lib/records";

export function filterProfileRecords(
  records: BookSummaryItemModel[],
  { book, keyword, order }: { book: string; keyword: string; order: string },
) {
  const normalize = (value: string) =>
    value.normalize("NFKC").toLocaleLowerCase();
  const query = normalize(keyword.trim());
  return records
    .filter(
      (record) =>
        (!book || recordBookKey(bookFromRecord(record)) === book) &&
        (!query ||
          normalize(
            `${record.bookTitle} ${plainText(record.content)}`,
          ).includes(query)),
    )
    .sort((a, b) => {
      const date = b.createAt.localeCompare(a.createAt) || b.id - a.id;
      if (order === "like")
        return (b.likeCount || 0) - (a.likeCount || 0) || date;
      if (order === "view")
        return (b.viewCount || 0) - (a.viewCount || 0) || date;
      return order === "asc" ? -date : date;
    });
}

export async function createDefaultProfileImage(nickname: string) {
  // 기존 이미지 업로드 API로 기본 아바타도 저장해 새로고침 후 상태를 유지한다.
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("기본 이미지를 만들지 못했어요.");
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, 256, 256);
  context.fillStyle = "#141414";
  const family =
    getComputedStyle(document.body).getPropertyValue("--font-gowun").trim() ||
    "serif";
  context.font = `700 112px ${family}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(nickname.slice(0, 1), 128, 128);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("기본 이미지를 만들지 못했어요.");
  return new File([blob], "readly-default-profile.png", { type: "image/png" });
}
