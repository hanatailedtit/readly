'use client';

import { CommonDropdownContext } from '@/components/ui/dropdown/CommonDropdown/CommonDropdown';
import { cn } from '@/utils/class-name.utils';
import { cva } from 'class-variance-authority';
import { ReactNode, useContext, useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';

export type CommonDropdownItemProps = {
  children: ReactNode;
  value: string;
  className?: ClassNameValue;
};

const commonDropdownItemVariants = cva(
  ['p-[8px]', 'hover:bg-gray/40', 'cursor-pointer', 'bg-white'].join(' '),
  {
    variants: {
      isSelected: {
        true: 'bg-main/40',
      },
    },
    defaultVariants: {
      isSelected: false,
    },
  },
);

export default function CommonDropdownItem({
  children,
  value,
  className,
}: CommonDropdownItemProps) {
  const { clickDropdownItem, currentValue } = useContext(CommonDropdownContext);

  const divClassName = useMemo(
    () =>
      cn(
        commonDropdownItemVariants({ isSelected: currentValue === value }),
        className,
      ),
    [currentValue, value, className],
  );

  const handleClickItem = () => {
    clickDropdownItem(value, children);
  };

  return (
    <div className={divClassName} onClick={handleClickItem}>
      {children}
    </div>
  );
}
