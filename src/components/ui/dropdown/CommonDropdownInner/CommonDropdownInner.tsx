'use client';

import { cn } from '@/utils/class-name.utils';
import { ReactNode, useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';

type CommonDropdownInnerProps = {
  children: ReactNode;
  className?: ClassNameValue;
};

export default function CommonDropdownInner({
  className,
  children,
}: CommonDropdownInnerProps) {
  const divClassName = useMemo(
    () =>
      cn(
        [
          'absolute',
          'shadow-lg',
          'shadow-gray/80',
          'min-w-full',
          'rounded-[8px]',
          'z-10',
          'bg-white',
          'overflow-hidden',
        ].join(' '),
        className,
      ),
    [className],
  );
  return <div className={divClassName}>{children}</div>;
}
