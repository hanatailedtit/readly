'use client';

import { cn } from '@/utils/class-name.utils';
import { cva, VariantProps } from 'class-variance-authority';
import { HTMLAttributes, useMemo } from 'react';

const dividerVariants = cva(['border-solid', 'border-gray'], {
  variants: {
    type: {
      horizontal: ['border-b', 'w-full'],
      vertical: ['border-l', 'h-full'],
    },
  },
  defaultVariants: {
    type: 'horizontal',
  },
});

type DividerVariant = VariantProps<typeof dividerVariants>;

type CommonDividerProps = {
  type?: NonNullable<DividerVariant['type']>;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function CommonDivider({
  className,
  type,
  ...rest
}: CommonDividerProps) {
  const divClassName = useMemo(
    () => cn(dividerVariants({ type }), className),
    [className, type],
  );
  return <div className={divClassName} {...rest}></div>;
}
