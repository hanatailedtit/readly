"use client";
import { useSearchParams } from "next/navigation";
import { useBookInfo } from "@/service/library.service";
import { RecordEditor } from "@/components/records/record-editor";
export default function CreatePage() {
  const isbn = useSearchParams().get("isbn");
  const lookup = useBookInfo(isbn);
  if (isbn && lookup.isLoading)
    return (
      <p className="py-16 text-center text-muted-foreground">
        책을 불러오고 있어요.
      </p>
    );
  const book = lookup.data;
  return (
    <RecordEditor key={book?.isbn || "new"} defaultBook={book ?? undefined} />
  );
}
