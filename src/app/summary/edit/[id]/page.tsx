'use client';

import BookSummaryCreateSection from '@/components/book/BookSummaryCreateSection/BookSummaryCreateSection';
import { useGetDetailBookSummaryQuery } from '@/service/book.service';
import { useParams } from 'next/navigation';

export default function SummaryEditPage() {
  const { id } = useParams();

  const { data } = useGetDetailBookSummaryQuery(Number(id));
  return (
    <>
      {data && (
        <BookSummaryCreateSection
          defaultBook={{
            author: data.bookAuthor,
            image: data.bookImage,
            pubdate: data.bookPubdate,
            title: data.bookTitle,
            publisher: data.bookPublisher,
            link: data.bookLink,
            isbn: data.isbn,
          }}
          defaultContent={data.content}
          defaultEndPage={data.endPage}
          defaultStartPage={data.startPage}
          defaultCategoryId={data.categoryId}
          defaultCategoryName={data.category}
          isEdit
          summaryId={String(id)}
        />
      )}
    </>
  );
}
