import { useClickOpenOutside } from '@/hooks/useClickOpenOutside';
import { BookCategoryDto } from '@/model/book/book.dto';
import { useGetBookCategoryListQuery } from '@/service/book.service';
import { Icon } from '@iconify/react/dist/iconify.js';
import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import CommonChip from '@/components/ui/chip/CommonChip/CommonChip';
import CommonDropdown from '@/components/ui/dropdown/CommonDropdown/CommonDropdown';
import CommonDropdownInner from '@/components/ui/dropdown/CommonDropdownInner/CommonDropdownInner';
import CommonDropdownItem from '@/components/ui/dropdown/CommonDropdownItem/CommonDropdownItem';
import type { CommonDropdownItemProps } from '@/components/ui/dropdown/CommonDropdownItem/CommonDropdownItem';
import CommonInput from '@/components/ui/input/CommonInput/CommonInput';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const searchTypeList: CommonDropdownItemProps[] = [
  {
    value: 'title',
    children: '책 제목',
  },
  {
    value: 'author',
    children: '작가',
  },
  {
    value: 'category',
    children: '카테고리',
  },
];

export default function SearchBookSummary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());
  const [option, setOption] = useState('title');
  const [value, setValue] = useState('');
  const [alertText, setAlertText] = useState('');
  const [selectedCategoryList, setSelectedCategoryList] = useState<string[]>(
    [],
  );
  const searchResultRef = useRef<HTMLDivElement | null>(null);
  const { isOpen: isOpenSearchResult, setIsOpen: setIsOpenSearchResult } =
    useClickOpenOutside({
      ref: searchResultRef,
    });

  const { data: categoryData } = useGetBookCategoryListQuery();
  const [categoryList, setCategoryList] = useState<BookCategoryDto[]>([]);

  const changeValue = (value: string) => {
    setValue(value);

    if (option === 'category' && categoryData) {
      const filteredList = categoryData.filter((item) => {
        return item.name.includes(value);
      });
      setCategoryList(filteredList);
    }
  };

  const changeOptionValue = (value: string) => {
    setOption(value);
  };

  const clickSearchButton = () => {
    if (!value && selectedCategoryList.length <= 0) {
      setAlertText('검색어를 입력해주세요.');
      return;
    }
    currentParams.set('type', option);
    currentParams.set(
      'keyword',
      option === 'category' ? JSON.stringify(selectedCategoryList) : value,
    );
    router.push(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/summary/search?${currentParams.toString()}`,
    );
  };

  const clickCategoryItem = (name: string) => {
    const addedList = [...selectedCategoryList];
    if (addedList.includes(name)) return;
    addedList.push(name);
    setSelectedCategoryList(addedList);
    setValue('');
    setCategoryList(categoryData || []);
  };

  const clickRemoveCategoryItem = (name: string) => {
    const filteredList = selectedCategoryList.filter((item) => item !== name);
    setSelectedCategoryList(filteredList);
  };

  const focusInputArea = () => {
    if (option === 'category') setIsOpenSearchResult(true);
  };

  useEffect(() => {
    if (!categoryData) return;
    setCategoryList(categoryData);
  }, [categoryData]);
  return (
    <div className="flex flex-row gap-x-[16px] w-full">
      <CommonDropdown
        value={option}
        onChange={changeOptionValue}
        label="책 제목"
      >
        <CommonDropdownInner>
          {searchTypeList.map((item) => (
            <CommonDropdownItem value={item.value} key={item.value}>
              {item.children}
            </CommonDropdownItem>
          ))}
        </CommonDropdownInner>
      </CommonDropdown>
      <div className="w-full relative flex-1">
        <CommonInput
          value={value}
          onChangeValue={changeValue}
          placeholder="검색어를 입력하세요."
          onEnter={clickSearchButton}
          alertText={alertText}
          innerClassName="min-w-[150px]"
          onFocus={focusInputArea}
        >
          {selectedCategoryList.map((item) => (
            <CommonChip
              text={item}
              key={item}
              variant="secondary"
              isActive
              removeIcon={<Icon icon="material-symbols:close-rounded" />}
              onClickRemove={() => clickRemoveCategoryItem(item)}
            />
          ))}
        </CommonInput>
        {isOpenSearchResult && (
          <div
            className="absolute w-full bg-white shadow-lg shadow-gray/80 rounded-[8px] overflow-hidden z-20"
            ref={searchResultRef}
          >
            <div className="flex flex-wrap p-[12px]">
              {categoryList.length > 0 &&
                categoryList.map((item) => (
                  <div className="w-[130px] p-[8px] " key={item.id}>
                    <CommonChip
                      text={item.name}
                      variant="secondary"
                      isActive
                      onClick={() => clickCategoryItem(item.name)}
                    />
                    {/* {item.name} */}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <CommonButton onClick={clickSearchButton}>검색</CommonButton>
    </div>
  );
}
