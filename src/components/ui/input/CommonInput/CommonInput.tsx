'use client';

import { cn } from '@/utils/class-name.utils';
import { cva } from 'class-variance-authority';
import {
  ChangeEvent,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  memo,
  ReactNode,
  Ref,
  useMemo,
} from 'react';
import { ClassNameValue } from 'tailwind-merge';

const commonInputWrapperVariants = cva(
  [
    'relative',
    'border',
    'border-gray',
    'focus:outline-main',
    'rounded-[8px]',
    'p-[8px]',
    'flex',
    'flex-row',
    'items-center',
    'border-gray',
    'gap-x-[4px]',
    'gap-y-[4px]',
    'flex-wrap',
  ],
  {
    variants: {
      isAlert: {
        true: 'border-red',
      },
    },
    defaultVariants: {
      isAlert: false,
    },
  },
);

type CommonInputProps = {
  value?: string;
  alertText?: string;
  placeholder?: string;
  className?: ClassNameValue;
  innerClassName?: ClassNameValue;
  type?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  onChangeValue?: (value: string) => void;
  onEnter?: () => void;
} & HTMLAttributes<HTMLInputElement>;

const CommonInput = forwardRef(
  (
    {
      value,
      alertText,
      placeholder,
      className,
      innerClassName,
      type,
      leftIcon,
      rightIcon,
      children,
      onChangeValue,
      onEnter,
      ...rest
    }: CommonInputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const handleChangeInputValue = (e: ChangeEvent) => {
      if (!onChangeValue) return;
      const element = e.target as HTMLInputElement;
      onChangeValue(element.value);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (onEnter && e.code === 'Enter') onEnter();
    };

    const divClassName = useMemo(
      () =>
        cn(
          commonInputWrapperVariants({ isAlert: Boolean(alertText) }),
          className,
        ),
      [className, alertText],
    );

    const inputClassName = useMemo(
      () =>
        cn(
          [
            'focus:outline-none',
            'text-black',
            'w-full',
            'h-full',
            'flex-1',
            'bg-transparent',
          ],
          innerClassName,
        ),
      [innerClassName],
    );

    return (
      <div className={divClassName}>
        {leftIcon && leftIcon}
        {children}
        <input
          className={inputClassName}
          onChange={handleChangeInputValue}
          onKeyUp={handleKeyUp}
          type={type}
          value={value}
          placeholder={placeholder}
          ref={ref}
          {...rest}
        />
        {rightIcon && rightIcon}
        <p className="text-md text-red absolute bottom-[-20px] whitespace-nowrap">
          {alertText}
        </p>
      </div>
    );
  },
);

CommonInput.displayName = 'CommonInput';
const MemoizedCommonInput = memo(CommonInput);

export { commonInputWrapperVariants, MemoizedCommonInput as default };
export type { CommonInputProps };
