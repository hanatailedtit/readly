'use client';

import { COLORS } from '@/constants/color.constants';
import { cn } from '@/utils/class-name.utils';
import { cva, VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  HTMLAttributes,
  memo,
  MouseEvent,
  ReactNode,
  Ref,
  useMemo,
} from 'react';

const chipVariants = cva(
  [
    'text-[14px]',
    'py-[2px]',
    'px-[8px]',
    'rounded-full',
    'cursor-pointer',
    'w-max',
    'hover:opacity-60',
    'flex',
    'flex-row',
    'gap-x-[4px]',
    'items-center',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-light-blue', 'text-blue'],
        secondary: ['bg-light-gray', 'text-dark-gray'],
        outline: ['bg-white', 'border', 'border-gray', 'text-black'],
        red: ['bg-light-red', 'text-red'],
        green: ['bg-light-green', 'text-green'],
        brown: ['bg-light-brown', 'text-brown'],
      },
      disabled: {
        true: ['opacity-40', 'hover:opacity-40', 'cursor-default'],
      },
      active: {
        true: ['text-white'],
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        active: true,
        class: 'bg-blue',
      },
      {
        variant: 'secondary',
        active: true,
        class: 'bg-dark-gray',
      },
      {
        variant: 'outline',
        active: true,
        class: 'bg-gray',
      },
      {
        variant: 'red',
        active: true,
        class: 'bg-red',
      },
      {
        variant: 'green',
        active: true,
        class: 'bg-green',
      },
      {
        variant: 'brown',
        active: true,
        class: 'bg-brown',
      },
    ],
    defaultVariants: {
      disabled: false,
      active: false,
      variant: 'primary',
    },
  },
);

type ChipVariant = NonNullable<VariantProps<typeof chipVariants>>;

type CommonChipProps = {
  text: string;
  value?: string;
  className?: string;
  backgroundColor?: string;
  activeColor?: string;
  isActive?: boolean;
  disabled?: boolean;
  variant?: ChipVariant['variant'];
  removeIcon?: ReactNode;
  onClick?: (value: string) => void;
  onClickRemove?: () => void;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'onClick'>;

const CommonChip = forwardRef(
  (
    {
      text,
      value,
      className,
      backgroundColor,
      activeColor,
      isActive,
      disabled,
      variant,
      removeIcon,
      onClick,
      onClickRemove,
    }: CommonChipProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const divClassName = useMemo(
      () =>
        cn(chipVariants({ disabled, active: isActive, variant }), className),
      [disabled, isActive, variant, className],
    );

    const handleClickChip = (e: MouseEvent) => {
      e.preventDefault();
      if (!disabled && onClick) onClick(value || '');
    };

    const handleClickRemove = (e: MouseEvent) => {
      e.preventDefault();
      if (onClickRemove) onClickRemove();
    };
    return (
      <div
        className={divClassName}
        style={{
          backgroundColor:
            backgroundColor && isActive ? activeColor : backgroundColor,
          color: activeColor && isActive ? COLORS.white : activeColor,
        }}
        onClick={handleClickChip}
        ref={ref}
      >
        {text}
        {removeIcon && <div onClick={handleClickRemove}> {removeIcon}</div>}
      </div>
    );
  },
);

CommonChip.displayName = 'CommonChip';

const MemoizedCommonChip = memo(CommonChip);

export { MemoizedCommonChip as default };
export type { CommonChipProps };
