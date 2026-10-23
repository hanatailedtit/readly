'use client';

import { COLORS } from '@/constants/color.constants';
import { Icon } from '@iconify/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import CommonButton from '@/components/ui/button/CommonButton/CommonButton';

type CommonPaginationProps = {
  pagination: number;
  totalCount: number;
  viewButtonCount?: number;
  buttonColor?: string;
  onClickPagination: (value: number) => void;
};

const CommonPagination = ({
  pagination,
  totalCount,
  viewButtonCount = 10,
  buttonColor = COLORS.main,
  onClickPagination,
}: CommonPaginationProps) => {
  const [buttonList, setButtonList] = useState<number[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  const isMatchPagination = useCallback(
    (value: number) => value === pagination,
    [pagination],
  );

  const pageList = useMemo(() => {
    return new Array(totalCount).fill(0).map((_, index) => index);
  }, [totalCount]);

  const isEndPrev = useCallback(() => currentSection <= 0, [currentSection]);
  const isEndNext = useCallback(() => {
    return (
      totalCount <= viewButtonCount ||
      currentSection + 1 >= Math.ceil(totalCount / viewButtonCount)
    );
  }, [currentSection, totalCount, viewButtonCount]);

  const handleClickPrevButton = () => {
    if (isEndPrev()) return;
    const afterPrevList = pageList.slice(
      viewButtonCount * (currentSection - 1),
      viewButtonCount * currentSection,
    );
    setButtonList(afterPrevList);
    setCurrentSection((section) => --section);
  };

  const handleClickNextButton = () => {
    if (isEndNext()) return;
    const afterNextList = pageList.slice(
      viewButtonCount * (currentSection + 1),
      viewButtonCount * (currentSection + 2),
    );

    setButtonList(afterNextList);
    setCurrentSection((section) => ++section);
  };

  const clickPaginationButton = (value: number) => {
    onClickPagination(value);
  };

  useEffect(() => {
    setButtonList(pageList.slice(0, viewButtonCount));
    setCurrentSection(0);
  }, [pageList, viewButtonCount]);

  return (
    <div className="flex flex-row items-center gap-x-[16px]">
      <div
        className="flex flex-row items-center gap-x-[4px]"
        onClick={handleClickPrevButton}
        style={{
          opacity: isEndPrev() ? 0.3 : 1,
          cursor: isEndPrev() ? 'default' : 'pointer',
        }}
      >
        <Icon icon="weui:arrow-filled" width={10} rotate={90} />
        <p>prev</p>
      </div>
      <div className="flex flex-row gap-x-[8px]">
        {buttonList.map((item) => (
          <CommonButton
            key={item}
            className={[
              'w-[35px] h-[35px] rounded-full text-[14px] p-0',
              isMatchPagination(item) ? 'text-white' : 'text-black',
              isMatchPagination(item) ? 'border-white' : 'border-gray',
            ]}
            onClick={() => clickPaginationButton(item)}
            style={{
              backgroundColor: isMatchPagination(item)
                ? buttonColor
                : COLORS.white,
            }}
          >
            {String(item + 1)}
          </CommonButton>
        ))}
      </div>
      <div
        onClick={handleClickNextButton}
        className="flex flex-row items-center gap-x-[4px]"
        style={{
          opacity: isEndNext() ? 0.3 : 1,
          cursor: isEndNext() ? 'default' : 'pointer',
        }}
      >
        <p>next</p>
        <Icon icon="weui:arrow-filled" width={10} />
      </div>
    </div>
  );
};

const MemoizedCommonPagination = memo(CommonPagination);

export { MemoizedCommonPagination as default };
export type { CommonPaginationProps };
