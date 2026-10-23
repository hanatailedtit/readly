import CommonSkeleton from '@/components/ui/skeleton/CommonSkeleton';

export default function BookSummaryDetailSkeleton() {
  return (
    <>
      <div className="flex flex-row justify-between text-md gap-x-[16px] w-full">
        <div className="flex flex-row items-center gap-x-[8px]">
          <CommonSkeleton width={30} height={30} className="rounded-[30px]" />
          <CommonSkeleton width={100} height={24} />
        </div>
        <div className="text-dark-gray flex flex-col gap-y-[8px] items-center">
          <CommonSkeleton width={100} height={24} />
        </div>
      </div>
      <div className="w-full flex flex-col gap-y-[16px]">
        <CommonSkeleton height={24} width="30%" />
        <CommonSkeleton height={24} width="50%" />
        <CommonSkeleton height={24} width="70%" />
      </div>
    </>
  );
}
