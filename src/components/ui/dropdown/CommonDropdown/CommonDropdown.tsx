'use client';

import { COLORS } from '@/constants/color.constants';
import { cn } from '@/utils/class-name.utils';
import { Icon } from '@iconify/react';
import { cva } from 'class-variance-authority';
import {
  createContext,
  forwardRef,
  InputHTMLAttributes,
  memo,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ClassNameValue } from 'tailwind-merge';

import LoadingSpinner from '../../loading/LoadingSpinner/LoadingSpinner';

type CommonDropdownProps = {
  value: string;
  children: ReactNode;
  placeholder?: string;
  className?: ClassNameValue;
  isLoading?: boolean;
  label?: ReactNode;
  onChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'className'>;

type CommonDropdownContextType = {
  clickDropdownItem: (value: string, children: ReactNode) => void;
  currentValue: string;
};

const dropdownVariants = cva(
  [
    'p-[8px]',
    'border',
    'border-solid',
    'border-gray',
    'rounded-[8px]',
    'min-w-[150px]',
    'flex',
    'flex-row',
    'items-center',
    'justify-between',
  ].join(' '),
  {
    variants: {
      isLoading: {
        true: 'cursor-default',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      isLoading: false,
    },
  },
);

export const CommonDropdownContext = createContext<CommonDropdownContextType>({
  clickDropdownItem: () => {},
  currentValue: '',
});

const CommonDropdown = forwardRef(
  (
    {
      value,
      placeholder = '선택',
      className,
      children,
      isLoading,
      label,
      onChange,
      ...rest
    }: CommonDropdownProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const divRef = useRef<HTMLDivElement | null>(null);
    const [itemChildren, setItemChildren] = useState<ReactNode | null>(label);

    const divClassName = useMemo(
      () => cn(dropdownVariants({ isLoading }), className),
      [className, isLoading],
    );

    const handleClickController = () => {
      setIsOpen(!isOpen);
    };

    const clickDropdownItem = (value: string, children: ReactNode) => {
      if (isLoading) return;
      setIsOpen(false);
      onChange(value);
      setItemChildren(children);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
      const element = event.target as HTMLElement;
      if (divRef.current && !divRef.current.contains(element)) {
        setIsOpen(false);
      }
    }, []);

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, handleClickOutside]);

    useImperativeHandle(ref, () => divRef.current || ({} as HTMLDivElement));

    return (
      <div ref={divRef} className="relative w-max">
        <div className={divClassName} onClick={handleClickController}>
          {placeholder && !itemChildren ? (
            <p className="text-dark-gray">{placeholder}</p>
          ) : (
            <div>{itemChildren}</div>
          )}
          {isLoading ? (
            <LoadingSpinner customSize={20} />
          ) : (
            <Icon
              icon="bxs:down-arrow"
              rotate={isOpen ? 90 : 0}
              color={COLORS.darkGray}
            />
          )}
        </div>
        <CommonDropdownContext.Provider
          value={{ clickDropdownItem, currentValue: value }}
        >
          {isOpen && !isLoading && children}
        </CommonDropdownContext.Provider>
        <input type="hidden" value={value} aria-hidden="true" {...rest} />
      </div>
    );
  },
);

CommonDropdown.displayName = 'CommonDropdown';

const MemoizedCommonDropdown = memo(CommonDropdown);

export { MemoizedCommonDropdown as default, dropdownVariants };
export type { CommonDropdownProps };
