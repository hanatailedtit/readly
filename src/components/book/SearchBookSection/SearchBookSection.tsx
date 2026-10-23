'use client';

import { useViewport } from '@/hooks/useViewport';
import { SearchBookItem } from '@/model/book/book.dto';
import {
  useGetRecentBookListQuery,
  useSearchBookMutation,
} from '@/service/book.service';
import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import CommonInput from '@/components/ui/input/CommonInput/CommonInput';
import CommonPagination from '@/components/pagination/CommonPagination/CommonPagination';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner/LoadingSpinner';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  MouseEvent,
  useRef,
} from 'react';
import BookItem from '../BookItem/BookItem';
import './SearchBookSection.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useClickOpenOutside } from '@/hooks/useClickOpenOutside';

export type SearchBookType = Pick<
  SearchBookItem,
  'author' | 'image' | 'pubdate' | 'title' | 'publisher' | 'isbn' | 'link'
>;

type SearchBookSectionProps = {
  defaultBook?: SearchBookType | null;
  clickSelect: (item: SearchBookType) => void;
};

export default function SearchBookSection({
  defaultBook = null,
  clickSelect,
}: SearchBookSectionProps) {
  const SEARCH_RESULT_KEY = 'book-search-result';

  const [inputValue, setInputValue] = useState('');
  const [isOpenResult, setIsOpenResult] = useState(false);
  const [selectedBook, setSelectedBook] = useState<SearchBookType | null>(
    defaultBook,
  );
  const [alertText, setAlertText] = useState('');
  const [pagination, setPagination] = useState(0);
  const [searchResultList, setSearchResultList] = useState<string[]>([]);
  const searchResultRef = useRef<HTMLDivElement | null>(null);

  const { isOpen: isOpenSearchResult, setIsOpen: setIsOpenSearchResult } =
    useClickOpenOutside({
      ref: searchResultRef,
    });

  const { data: recentBookData, isLoading: recentBookLoading } =
    useGetRecentBookListQuery();
  const { mutate, data: bookData } = useSearchBookMutation();
  const { isSm } = useViewport();

  const displayCount = useMemo(() => (isSm ? 8 : 12), [isSm]);

  const reducer = (state: number, action: number | undefined) => {
    if (typeof action === 'undefined') return state;
    return Math.ceil(action / displayCount);
  };

  const [countState, dispatch] = useReducer(reducer, 0);

  const searchBook = (text?: string) => {
    const value = text || inputValue;
    setAlertText('');
    if (!value) {
      setAlertText('첵 제목을 입력해주세요.');
      return;
    }
    if (value.length < 2) {
      setAlertText('두 글자 이상을 입력해주세요.');
      return;
    }
    setIsOpenResult(true);
    mutate({ query: value, display: String(displayCount) });
    setPagination(0);
    saveSearchResult();
    setIsOpenSearchResult(false);
  };

  const clickPaginationButton = (pagination: number) => {
    setPagination(pagination);
    mutate({
      query: inputValue,
      start: String(pagination * displayCount + 1),
      display: String(displayCount),
    });
  };

  const clickBookItem = (item: SearchBookItem) => {
    setSelectedBook(item);
    clickSelect(item);
    setIsOpenSearchResult(false);
  };

  const focusInputArea = () => {
    setIsOpenSearchResult(true);
  };

  const saveSearchResult = useCallback(() => {
    const list = [...searchResultList];
    if (!inputValue || list.includes(inputValue)) return;
    list.unshift(inputValue);
    localStorage.setItem(SEARCH_RESULT_KEY, JSON.stringify(list));
    const sliceList = list.slice(0, 10);
    setSearchResultList(sliceList);
  }, [searchResultList, inputValue]);

  const handleClickSearchResult = (value: string) => {
    setInputValue(value);
    searchBook(value);
  };

  const handleClickRemoveSearchResult = (e: MouseEvent, value: string) => {
    e.stopPropagation();
    const filteredList = searchResultList.filter((item) => item !== value);
    localStorage.setItem(SEARCH_RESULT_KEY, JSON.stringify(filteredList));
    setSearchResultList(filteredList);
  };

  useEffect(() => {
    dispatch(bookData?.total);
  }, [bookData?.total]);

  useEffect(() => {
    const storageResult = localStorage.getItem(SEARCH_RESULT_KEY);
    if (!storageResult) return;
    const list = JSON.parse(storageResult);
    if (!Array.isArray(list)) return;
    setSearchResultList(list);
  }, []);

  return (
    <div className="search-book-section flex flex-col items-center gap-y-[16px]">
      <div className="flex flex-col sm:flex-row gap-x-[16px] gap-y-[8px] w-full">
        <div className="w-full flex-1 relative">
          <CommonInput
            value={inputValue}
            onChangeValue={setInputValue}
            onEnter={searchBook}
            placeholder="책 제목을 2자 이상 입력해주세요."
            alertText={alertText}
            onFocus={focusInputArea}
          />
          {isOpenSearchResult && (
            <div
              className="absolute w-full bg-white shadow-lg shadow-gray/80 rounded-[8px] overflow-hidden z-20"
              ref={searchResultRef}
            >
              {searchResultList.length > 0 && (
                <ul>
                  <li className="px-[16px] py-[8px] font-bold">최근 검색어</li>
                  {searchResultList.map((item) => (
                    <li
                      key={item}
                      className="px-[16px] py-[8px] hover:bg-light-gray flex flex-row justify-between items-center cursor-pointer"
                      onClick={() => handleClickSearchResult(item)}
                    >
                      <p>{item}</p>
                      <Icon
                        icon="ic:round-close"
                        className="cursor-pointer"
                        width={20}
                        onClick={(e) => handleClickRemoveSearchResult(e, item)}
                      />
                    </li>
                  ))}
                </ul>
              )}
              <div className="p-[16px]">
                <p className="py-[8px] font-bold">최근 등록한 책</p>
                {recentBookLoading && (
                  <div className="w-full flex flex-row justify-center">
                    <LoadingSpinner />
                  </div>
                )}
                {recentBookData &&
                  (recentBookData.length > 0 ? (
                    recentBookData.map((item) => (
                      <BookItem
                        key={item.isbn}
                        author={item.author}
                        image={item.image}
                        pubdate={item.pubdate}
                        publisher={item.publisher}
                        title={item.title}
                        isWide
                        imageWidth={100}
                        isbn={item.isbn}
                        clickItem={() => clickBookItem(item)}
                      />
                    ))
                  ) : (
                    <p className="text-center w-full text-dark-gray text-md">
                      최근 등록한 책이 없습니다.
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
        <CommonButton onClick={() => searchBook()}>검색</CommonButton>
      </div>
      {isOpenResult && (
        <div className="flex flex-col items-center gap-y-[16px]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-[8px] gap-y-[8px]">
            {bookData?.items &&
              bookData.items.map((item, index) => (
                <div key={`${JSON.stringify(item)}-${index}`}>
                  <BookItem
                    author={item.author}
                    image={item.image}
                    pubdate={item.pubdate}
                    publisher={item.publisher}
                    title={item.title}
                    isbn={item.isbn}
                    clickItem={() => clickBookItem(item)}
                    isSelected={item.isbn === selectedBook?.isbn}
                  />
                </div>
              ))}
          </div>
          <CommonPagination
            pagination={pagination}
            totalCount={countState}
            onClickPagination={clickPaginationButton}
            viewButtonCount={isSm ? 5 : 10}
          />
        </div>
      )}
      {selectedBook && (
        <div className="w-full">
          <BookItem
            author={selectedBook.author}
            image={selectedBook.image}
            isbn={selectedBook.isbn}
            pubdate={selectedBook.pubdate}
            publisher={selectedBook.publisher}
            title={selectedBook.title}
            cursor="default"
            isWide
            imageWidth={100}
          />
        </div>
      )}
    </div>
  );
}
