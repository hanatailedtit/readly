'use client';

import { COLORS } from '@/constants/color.constants';
import { cn } from '@/utils/class-name.utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { getFileInfo } from '@/utils/string.utils';
import { ChangeEvent, forwardRef, HTMLAttributes, Ref, useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';

import EllipsisText from '@/components/ui/text/EllipsisText/EllipsisText';

type CommonFileInputProps = {
  placeholder?: string;
  value: FileList | null;
  onChangeValue: (files: FileList | null) => void;
  accept?: string;
  className?: ClassNameValue;
} & Omit<
  HTMLAttributes<HTMLInputElement>,
  'type' | 'id' | 'className' | 'onChange'
>;

const CommonFileInput = forwardRef(
  (
    {
      placeholder = '파일 업로드',
      value,
      onChangeValue,
      accept = '.jpg, .png, .webp',
      className,
    }: CommonFileInputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const divClassName = useMemo(
      () =>
        cn(
          [
            'h-[40px]',
            'bg-white',
            'border',
            'border-gray',
            'border-solid',
            'rounded-[8px]',
          ],
          className,
        ),
      [className],
    );

    const fileInfo = useMemo(() => {
      if (!value || value.length <= 0 || !value[0]) return null;
      return getFileInfo(value[0].name);
    }, [value]);

    const handleChangeInput = (e: ChangeEvent) => {
      const element = e.target as HTMLInputElement;
      const files = element.files;

      if (!files) return;
      onChangeValue(element.files);
    };

    return (
      <div className={divClassName}>
        <label
          htmlFor="common-file"
          className="p-[8px] flex flex-row items-center gap-x-[8px] cursor-pointer"
        >
          <Icon
            icon="line-md:file-filled"
            width={20}
            color={COLORS.darkGray}
          />
          <div className="text-md flex-1 flex flex-row">
            {!fileInfo && <p>{placeholder}</p>}
            {fileInfo?.name && (
              <EllipsisText text={fileInfo.name} lineClamp={1} fontSize={14} />
            )}
            {fileInfo?.extension && <p>.{fileInfo?.extension}</p>}
          </div>
        </label>
        <input
          type="file"
          id="common-file"
          className="hidden"
          onChange={handleChangeInput}
          ref={ref}
          accept={accept}
        />
      </div>
    );
  },
);

CommonFileInput.displayName = 'CommonFileInput';

export { CommonFileInput as default };
export type { CommonFileInputProps };
