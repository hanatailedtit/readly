'use client';

import { cn } from '@/utils/class-name.utils';
import { cva, VariantProps } from 'class-variance-authority';
import { useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';

const skeletonVariants = cva(
  ['w-full', 'h-full', 'bg-light-gray', 'animate-pulse'],
  {
    variants: {
      shape: {
        rectangle: 'rounded-[16px]',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      shape: 'rectangle',
    },
  },
);

type SkeletonVariants = VariantProps<typeof skeletonVariants>;

type CommonSkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: ClassNameValue;
  shape?: NonNullable<SkeletonVariants['shape']>;
};

export default function CommonSkeleton({
  width,
  height,
  className,
  shape,
}: CommonSkeletonProps) {
  const divClassName = useMemo(
    () => cn(skeletonVariants({ shape }), className),
    [shape, className],
  );
  return (
    <div
      className={divClassName}
      style={{
        height,
        width,
      }}
    ></div>
  );
}
