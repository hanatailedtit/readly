'use client';

import LoadingSpinner from '@/components/ui/loading/LoadingSpinner/LoadingSpinner';
import { COLORS } from '@/constants/color.constants';
import { cn } from '@/utils/class-name.utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef, memo, useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';

const buttonVariants = cva(
  [
    'text-white',
    'text-[16px]',
    'border',
    'border-transparent',
    'rounded-[8px]',
    'px-[16px]',
    'py-[6px]',
    'flex',
    'flex-row',
    'items-center',
    'gap-x-[8px]',
    'justify-center',
    'transition-colors',
    'hover:opacity-100',
    'disabled:opacity-60',
    'disabled:hover:opacity-60',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-main', 'md:hover:bg-dark-main', 'disabled:hover:bg-main'],
        secondary: [
          'bg-gray',
          'md:hover:bg-dark-gray',
          'disabled:hover:bg-gray',
        ],
        red: ['bg-red', 'md:hover:bg-dark-red', 'disabled:hover:bg-red'],
        outline: [
          'bg-white',
          'border-gray',
          'text-black',
          'md:hover:bg-light-gray',
          'disabled:hover:bg-white',
        ],
        ghost: [
          'bg-transparent',
          'text-black',
          'md:hover:bg-light-gray',
          'disabled:hover:bg-transparent',
        ],
        link: [
          'bg-transparent',
          'text-black',
          'underline',
          'md:hover:bg-light-gray',
          'disabled:hover:bg-transparent',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;

interface ButtonBaseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  className?: ClassNameValue;
  isLoading?: boolean;
  loadingColor?: string;
  loadingWidth?: number;
  variant?: ButtonVariant;
}

type CommonButtonProps = ButtonBaseProps & VariantProps<typeof buttonVariants>;

const CommonButton = forwardRef<HTMLButtonElement, CommonButtonProps>(
  (
    {
      children,
      disabled = false,
      isLoading = false,
      loadingWidth = 23,
      loadingColor = '#5ae9e4',
      className,
      variant = 'primary',
      onClick,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const buttonClassName = useMemo(
      () => cn(buttonVariants({ variant }), className),
      [variant, className],
    );

    const spinnerColor = useMemo(() => {
      if (['primary', 'secondary', 'red'].includes(variant)) {
        return COLORS.white;
      }
      return loadingColor;
    }, [variant, loadingColor]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      onClick?.(event);
    };

    const buttonContent = useMemo(() => {
      if (isLoading) {
        return (
          <LoadingSpinner customSize={loadingWidth} color={spinnerColor} />
        );
      }
      return children;
    }, [isLoading, loadingWidth, spinnerColor, children]);

    return (
      <button
        ref={ref}
        className={buttonClassName}
        onClick={handleClick}
        disabled={disabled || isLoading}
        type={type}
        aria-busy={isLoading}
        {...rest}
      >
        {buttonContent}
      </button>
    );
  },
);

CommonButton.displayName = 'CommonButton';

const MemoizedCommonButton = memo(CommonButton);

export { buttonVariants, MemoizedCommonButton as default };
export type { ButtonVariant, CommonButtonProps };
