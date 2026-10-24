"use client";
import { useParams } from "next/navigation";
import { useGetDetailBookSummaryQuery } from "@/service/book.service";
import { RecordEditor } from "@/components/records/record-editor";
import { LoadError } from "@/components/records/record-list";
export default function EditPage() {
  const { id } = useParams<{ id: string }>(),
    query = useGetDetailBookSummaryQuery(Number(id));
  if (query.isError) return <LoadError retry={query.refetch} />;
  return query.data ? (
    <RecordEditor key={id} record={query.data} />
  ) : (
    <p className="py-16 text-muted-foreground">기록을 불러오고 있어요.</p>
  );
}
