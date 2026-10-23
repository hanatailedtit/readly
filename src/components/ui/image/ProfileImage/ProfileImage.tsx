'use client';

import { cn } from '@/utils/class-name.utils';
import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, memo, Ref, SyntheticEvent, useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';

const profileImageWrapperVariants = cva(
  [
    'relative',
    'rounded-full',
    'overflow-hidden',
    'border',
    'border-gray',
    'bg-white',
    'flex',
    'flex-row',
    'justify-center',
    'items-center',
  ],
  {
    variants: {
      size: {
        small: ['w-[32px]', 'h-[32px]', 'min-w-[32px]', 'min-h-[32px]'],
        medium: ['w-[50px]', 'h-[50px]', 'min-w-[50px]', 'min-h-[50px]'],
        large: ['w-[80px]', 'h-[80px]', 'min-w-[80px]', 'min-h-[80px]'],
        xLarge: ['w-[120px]', 'h-[120px]', 'min-w-[120px]', 'min-h-[120px]'],
      },
    },
    defaultVariants: {
      size: 'small',
    },
  },
);

type ProfileImageWrapperVariant = VariantProps<
  typeof profileImageWrapperVariants
>;

type ProfileImageProps = {
  imageSrc?: string | null;
  size?: ProfileImageWrapperVariant['size'];
  className?: ClassNameValue;
};

const ProfileImage = forwardRef(
  (
    { imageSrc, size, className }: ProfileImageProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const defaultImage =
      '/images/users/default-profile-image.webp';

    const divClassName = useMemo(
      () => cn(profileImageWrapperVariants({ size }), className),
      [size, className],
    );

    const handleErrorImage = (e: SyntheticEvent<HTMLImageElement, Event>) => {
      const element = e.target as HTMLImageElement;
      element.src = defaultImage;
    };
    return (
      <div className={divClassName} ref={ref}>
        <img
          src={imageSrc || defaultImage}
          alt="profile-image"
          className="w-full h-full"
          onError={handleErrorImage}
        />
      </div>
    );
  },
);

ProfileImage.displayName = 'ProfileImage';

const MemoizedProfileImage = memo(ProfileImage);

export { MemoizedProfileImage as default, profileImageWrapperVariants };
export type { ProfileImageProps, ProfileImageWrapperVariant };
