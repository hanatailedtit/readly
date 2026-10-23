'use client';

import { cn } from '@/utils/class-name.utils';
import { parseDomSizeValue } from '@/utils/string.utils';
import { useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';
import './EllipsisText.scss';

type EllipsisTextProps = {
  text: string;
  width?: string | number;
  height?: string | number;
  lineClamp?: number;
  fontSize?: string | number;
  className?: ClassNameValue;
};

const EllipsisText = ({
  text,
  width = 'auto',
  height = 'auto',
  lineClamp = 2,
  fontSize = 16,
  className,
}: EllipsisTextProps) => {
  const divClassName = useMemo(
    () => cn('ellipsis-text', className),
    [className],
  );
  return (
    <div
      className={divClassName}
      style={{
        WebkitLineClamp: lineClamp,
        width: parseDomSizeValue(width),
        height: parseDomSizeValue(height),
        fontSize: parseDomSizeValue(fontSize),
      }}
    >
      {text}
    </div>
  );
};

export { EllipsisText as default };
export type { EllipsisTextProps };
