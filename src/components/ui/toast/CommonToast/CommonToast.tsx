'use client';

import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/class-name.utils';
import { cva, VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  HTMLAttributes,
  memo,
  ReactNode,
  Ref,
  useMemo,
} from 'react';
import { ClassNameValue } from 'tailwind-merge';
import './CommonToast.scss';

const toastVariants = cva(
  [
    'w-[280px]',
    'rounded-[8px]',
    'p-[16px]',
    'relative',
    'top-[16px]',
    'right-[16px]',
    'animate-show-toast',
    'text-white',
    'z-100',
  ].join(' '),
  {
    variants: {
      show: {
        true: 'right-[16px]',
        false: 'right-[-280px]',
      },
      variant: {
        normal: ['bg-main'].join(' '),
        outline: ['border', 'border-gray', 'bg-white', 'text-black'].join(' '),
        success: ['bg-green'].join(' '),
        error: ['bg-red'].join(' '),
      },
    },
    defaultVariants: {
      show: true,
      variant: 'normal',
    },
  },
);

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>>;

interface CommonToastProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  className?: ClassNameValue;
  closeChildren?: ReactNode;
  title?: string;
  description?: string;
  isShow?: boolean;
  id?: string;
  variant?: ToastVariant['variant'];
}

const CommonToast = forwardRef(
  (
    {
      className,
      title,
      description,
      closeChildren,
      isShow,
      id,
      variant,
    }: CommonToastProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const { deleteToast } = useToast();
    const divClassName = useMemo(
      () =>
        cn(
          toastVariants({
            show: isShow,
            variant,
          }),
          className,
        ),
      [className, isShow, variant],
    );

    const closeContent = useMemo(
      () =>
        closeChildren || (
          <CommonButton
            variant="outline"
            className="text-md px-[8px] py-[4px] rounded-[4px]"
          >
            닫기
          </CommonButton>
        ),
      [closeChildren],
    );

    const handleClickClose = () => {
      if (!id) return;
      deleteToast(id);
    };

    return (
      <div className={`common-toast ${divClassName}`} ref={ref}>
        <div className="flex flex-row justify-between gap-x-[8px]">
          <div className="flex-1">
            {title && <p className="font-bold break-all">{title}</p>}
            {description && <p className="text-md break-all">{description}</p>}
          </div>
          <div className="cursor-pointer" onClick={handleClickClose}>
            {closeContent}
          </div>
        </div>
      </div>
    );
  },
);

CommonToast.displayName = 'CommonToast';
const MemoizedCommonToast = memo(CommonToast);

export { MemoizedCommonToast as default };
export type { CommonToastProps };
