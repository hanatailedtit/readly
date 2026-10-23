'use client';

import { cn } from '@/utils/class-name.utils';
import { cva } from 'class-variance-authority';
import {
  ChangeEvent,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  memo,
  Ref,
  useMemo,
} from 'react';

const textareaVariants = cva(
  [
    'border',
    'border-gray',
    'focus:outline-main',
    'text-black',
    'w-full',
    'h-full',
    'resize-none',
    'rounded-[8px]',
    'p-[8px]',
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

type CommonTextareaProps = {
  value: string;
  placeholder?: string;
  alertText?: string;
  disabled?: boolean;
  className?: string;
  onChangeValue: (value: string) => void;
  onEnter?: () => void;
} & HTMLAttributes<HTMLTextAreaElement>;

const CommonTextarea = forwardRef(
  (
    {
      value,
      alertText,
      className,
      onChangeValue,
      onEnter,
      ...rest
    }: CommonTextareaProps,
    ref: Ref<HTMLTextAreaElement>,
  ) => {
    const textareaClassName = useMemo(
      () => cn(textareaVariants({ isAlert: Boolean(alertText) }), className),
      [className, alertText],
    );

    const handleChangeTextareaValue = (e: ChangeEvent) => {
      const element = e.target as HTMLInputElement;
      onChangeValue(element.value);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (onEnter && e.code === 'Enter') onEnter();
    };

    return (
      <div className="flex flex-col relative h-full w-full">
        <textarea
          className={textareaClassName}
          value={value}
          onChange={handleChangeTextareaValue}
          onKeyUp={handleKeyUp}
          ref={ref}
          {...rest}
        />
        <p className="text-md text-red absolute bottom-[-20px]">{alertText}</p>
      </div>
    );
  },
);

CommonTextarea.displayName = 'CommonTextarea';

const memoizedCommonTextArea = memo(CommonTextarea);

export { memoizedCommonTextArea as default, textareaVariants };
export type { CommonTextareaProps };
