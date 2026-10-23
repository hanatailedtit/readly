'use client';

import { cn } from '@/utils/class-name.utils';
import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, HTMLAttributes, memo, Ref, useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';

const wrapperVariants = cva(
  ['cursor-pointer', 'p-[4px]', 'rounded-full', 'flex', 'flex-row', 'relative'],
  {
    variants: {
      variant: {
        primary: 'bg-main',
        secondary: 'bg-dark-gray',
        outline: ['bg-white', 'border', 'border-solid', 'border-gray'],
        green: 'bg-green',
        red: 'bg-red',
      },
      size: {
        small: ['w-[46px]', 'h-[25px]'],
        medium: ['w-[76px]', 'h-[38px]'],
        large: ['w-[104px]', 'h-[50px]'],
      },
      on: {
        false: ['bg-gray'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      on: false,
    },
  },
);

const buttonVariants = cva(
  ['bg-white', 'rounded-full', 'absolute', 'transition-all'],
  {
    variants: {
      variant: {
        primary: 'bg-white',
        secondary: 'bg-white',
        outline: 'bg-dark-gray',
        green: 'bg-white',
        red: 'bg-white',
      },
      size: {
        small: ['w-[17px]', 'h-[17px]', 'right-[24px]'],
        medium: ['w-[30px]', 'h-[30px]', 'right-[42px]'],
        large: ['w-[41px]', 'h-[41px]', 'right-[58px]'],
      },
      on: {
        true: ['right-[4px]'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      on: false,
    },
  },
);

type WrapperVariant = VariantProps<typeof wrapperVariants>;

type ToggleButtonProps = {
  isOn?: boolean;
  className?: ClassNameValue;
  toggleClassName?: ClassNameValue;
  variant?: NonNullable<WrapperVariant['variant']>;
  size?: NonNullable<WrapperVariant['size']>;
  onClick: (value: boolean) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>;

const ToggleButton = forwardRef(
  (
    {
      isOn,
      className,
      toggleClassName,
      variant = 'primary',
      size = 'medium',
      onClick,
    }: ToggleButtonProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const divClassName = useMemo(
      () => cn(wrapperVariants({ variant, size, on: isOn }), className),
      [variant, size, isOn, className],
    );
    const buttonClassName = useMemo(
      () => cn(buttonVariants({ variant, size, on: isOn }), toggleClassName),
      [variant, size, isOn, toggleClassName],
    );
    const handleClickToggleButton = () => {
      onClick(!isOn);
    };
    return (
      <div ref={ref} className={divClassName} onClick={handleClickToggleButton}>
        <div className={buttonClassName}></div>
      </div>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';

const memorizedToggleButton = memo(ToggleButton);

export { memorizedToggleButton as default };
export type { ToggleButtonProps, WrapperVariant };
