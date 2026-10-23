'use client';

import SearchBookSection, {
  SearchBookType,
} from '@/components/book/SearchBookSection/SearchBookSection';
import { COLORS } from '@/constants/color.constants';
import {
  useCreateBookSummaryMutation,
  useEditBookSummaryMutation,
  useGetBookCategoryListQuery,
} from '@/service/book.service';
import { Editor } from '@tinymce/tinymce-react';
import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import CommonDropdown from '@/components/ui/dropdown/CommonDropdown/CommonDropdown';
import CommonDropdownInner from '@/components/ui/dropdown/CommonDropdownInner/CommonDropdownInner';
import CommonDropdownItem from '@/components/ui/dropdown/CommonDropdownItem/CommonDropdownItem';
import CommonInput from '@/components/ui/input/CommonInput/CommonInput';
import ToggleButton from '@/components/ui/button/ToggleButton/ToggleButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type BookSummaryCreateSectionProps = {
  defaultBook?: SearchBookType | null;
  defaultContent?: string;
  defaultStartPage?: number;
  defaultEndPage?: number;
  defaultCategoryId?: number;
  defaultCategoryName?: string;
  isEdit?: boolean;
  summaryId?: string;
};

export default function BookSummaryCreateSection({
  defaultBook = null,
  defaultContent = '',
  defaultEndPage,
  defaultStartPage,
  defaultCategoryId,
  defaultCategoryName = '',
  isEdit,
  summaryId,
}: BookSummaryCreateSectionProps) {
  const [selectedBook, setSelectedBook] = useState<SearchBookType | null>(
    defaultBook,
  );
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const [content, setContent] = useState(defaultContent);
  const [startPage, setStartPage] = useState(defaultStartPage);
  const [endPage, setEndPage] = useState(defaultEndPage);
  const [bookAlertMessage, setBookAlertMessage] = useState('');
  const [categoryAlertMessage, setCategoryAlertMessage] = useState('');
  const [contentAlertMessage, setContentAlertMessage] = useState('');
  const [isRecodePage, setIsRecodePage] = useState(
    Boolean(defaultStartPage && defaultEndPage),
  );

  const { mutateAsync: createMutate, isPending: isCreatePending } =
    useCreateBookSummaryMutation();
  const { mutateAsync: editMutate, isPending: isEditPending } =
    useEditBookSummaryMutation();
  const router = useRouter();
  const { data: categoryData, isLoading: categoryLoading } =
    useGetBookCategoryListQuery();

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const clickToggleButton = (value: boolean) => {
    setStartPage(undefined);
    setEndPage(undefined);
    setIsRecodePage(value);
  };

  const changeStartPage = (value: string) => {
    setStartPage(Number(value));
  };

  const changeEndPage = (value: string) => {
    setEndPage(Number(value));
  };

  const changeCategoryId = (value: string) => {
    setCategoryId(Number(value));
  };

  const clickEndButton = async () => {
    if (!selectedBook) {
      setBookAlertMessage('읽은 책을 선택하여야 합니다.');
      return;
    }
    if (!categoryId) {
      setCategoryAlertMessage('카테고리를 선택하여야 합니다.');
      return;
    }
    if (!content) {
      setContentAlertMessage('요약 작성이 필요합니다.');
      return;
    }

    if (isEdit) {
      await editMutate({
        content,
        bookInfo: selectedBook,
        startPage,
        endPage,
        id: Number(summaryId),
        category_id: Number(categoryId),
      });
      router.push(`/summary/detail/${summaryId}`);
    } else {
      await createMutate({
        content,
        bookInfo: selectedBook,
        startPage,
        endPage,
        category_id: Number(categoryId),
      });
      router.push('/');
    }
  };

  useEffect(() => {
    if (selectedBook) {
      setBookAlertMessage('');
    }
    if (content) {
      setContentAlertMessage('');
    }
    if (categoryId) {
      setCategoryAlertMessage('');
    }
  }, [selectedBook, content, categoryId]);

  return (
    <div className="flex flex-col gap-y-[16px]">
      <h1 className="text-lg font-bold">읽은 책</h1>
      <SearchBookSection
        clickSelect={setSelectedBook}
        defaultBook={defaultBook}
      />
      {bookAlertMessage && (
        <p className="text-md text-red">{bookAlertMessage}</p>
      )}
      <h1 className="text-lg font-bold">카테고리</h1>
      <CommonDropdown
        onChange={changeCategoryId}
        className="w-full sm:w-[300px]"
        value={String(categoryId)}
        label={defaultCategoryName}
        isLoading={categoryLoading}
      >
        {categoryData && (
          <CommonDropdownInner>
            <div className="grid grid-cols-2">
              {categoryData.map((item) => (
                <CommonDropdownItem
                  value={String(item.id)}
                  key={item.id}
                >
                  {item.name}
                </CommonDropdownItem>
              ))}
            </div>
          </CommonDropdownInner>
        )}
      </CommonDropdown>
      {categoryAlertMessage && (
        <p className="text-md text-red">{categoryAlertMessage}</p>
      )}
      <h1 className="text-lg font-bold">요약</h1>
      <p>읽었던 책의 요약 또는 구절, 느낀점 등을 다양하게 기록해 보세요.</p>
      <Editor
        id="tiny-mce-editor"
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onEditorChange={handleEditorChange}
        value={content}
      />
      {contentAlertMessage && (
        <p className="text-md text-red">{contentAlertMessage}</p>
      )}
      <div className="flex flex-row gap-x-[16px]">
        <h1 className="text-lg font-bold">쪽수 기록</h1>
        <ToggleButton onClick={clickToggleButton} isOn={isRecodePage} />
      </div>
      {isRecodePage && (
        <div className="flex flex-row items-center gap-x-[8px]">
          <CommonInput
            onChangeValue={changeStartPage}
            type="number"
            value={String(startPage)}
            className="w-[70px]"
          />
          <p>~</p>
          <CommonInput
            onChangeValue={changeEndPage}
            type="number"
            value={String(endPage)}
            className="w-[70px]"
          />
        </div>
      )}
      <CommonButton
        onClick={clickEndButton}
        className="text-[16px] font-bold bg-main text-white border-transparent px-[10px] py-[16px]"
        isLoading={isCreatePending || isEditPending}
        loadingColor={COLORS.white}
      >
        작성
      </CommonButton>
    </div>
  );
}
