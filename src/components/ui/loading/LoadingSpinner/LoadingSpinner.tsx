'use client';

import { COLORS } from '@/constants/color.constants';
import { cn } from '@/utils/class-name.utils';
import { cva, VariantProps } from 'class-variance-authority';
import { useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';

import './LoadingSpinner.scss';

const loadingSpinnerVariants = cva(['rounded-full', 'border', 'border-solid'], {
  variants: {
    size: {
      small: ['w-[24px]', 'h-[24px]', 'border-[3px]'],
      medium: ['w-[50px]', 'h-[50px]', 'border-[4px]'],
      large: ['w-[80px]', 'h-[80px]', 'border-[6px]'],
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

type LoadingSpinnerVariant = VariantProps<typeof loadingSpinnerVariants>;

type LoadingSpinnerProps = {
  color?: string;
  customSize?: string | number;
  backgroundColor?: string;
  size?: NonNullable<LoadingSpinnerVariant['size']>;
  className?: ClassNameValue;
};

function LoadingSpinner({
  color = COLORS.main,
  backgroundColor = 'rgba(255, 255, 255, 0.5)',
  size,
  className,
  customSize,
}: LoadingSpinnerProps) {
  const divClassName = useMemo(
    () => cn(loadingSpinnerVariants({ size }), 'loading-spinner', className),
    [size, className],
  );
  return (
    <div
      className={divClassName}
      style={{
        borderTopColor: color,
        borderBottomColor: backgroundColor,
        borderLeftColor: backgroundColor,
        borderRightColor: backgroundColor,
        width: customSize,
        height: customSize,
      }}
    ></div>
  );
}

export { LoadingSpinner as default, loadingSpinnerVariants };
export type { LoadingSpinnerProps, LoadingSpinnerVariant };
