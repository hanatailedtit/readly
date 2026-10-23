import CommonSkeleton from '@/components/ui/skeleton/CommonSkeleton';
import { parseDomSizeValue } from '@/utils/string.utils';

type BookItemProps = {
  isWide?: boolean;
  imageWidth?: string | number;
};

export default function BookItemSkeleton({
  isWide,
  imageWidth = '100%',
}: BookItemProps) {
  return (
    <div
      className="p-[8px] rounded-[8px] w-full h-full flex gap-x-[16px]"
      style={{
        flexDirection: isWide ? 'row' : 'column',
      }}
    >
      <CommonSkeleton width={parseDomSizeValue(imageWidth)} height={200} />
      <div className="py-[8px] flex flex-col gap-y-[8px] flex-1">
        <CommonSkeleton height={24} width={150} />
        <CommonSkeleton height={24} width={80} />
        <CommonSkeleton height={24} width={70} />
        <CommonSkeleton height={24} width={100} />
      </div>
    </div>
  );
}
