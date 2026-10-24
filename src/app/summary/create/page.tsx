"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchBookList } from "@/repository/book.repository";
import { toSearchBookItemModel } from "@/model/book/book.dto";
import { RecordEditor } from "@/components/records/record-editor";
export default function CreatePage() {
  const isbn = useSearchParams().get("isbn");
  const lookup = useQuery({
    queryKey: ["write-book", isbn],
    enabled: !!isbn,
    queryFn: async () =>
      toSearchBookItemModel(await searchBookList({ query: isbn! })),
  });
  if (isbn && lookup.isLoading)
    return (
      <p className="py-16 text-center text-muted-foreground">
        책을 불러오고 있어요.
      </p>
    );
  const book = lookup.data?.items.find(
    (b) => b.isbn === isbn || b.isbn.split(" ").includes(isbn || ""),
  );
  return <RecordEditor key={book?.isbn || "new"} defaultBook={book} />;
}
