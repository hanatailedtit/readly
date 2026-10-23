import CommonSkeleton from '@/components/ui/skeleton/CommonSkeleton';

export default function BookCategorySkeleton() {
  return (
    <div className="w-full flex flex-col gap-y-[16px]">
      <CommonSkeleton width="100%" height={24} />
      <CommonSkeleton width="100%" height={24} />
      <CommonSkeleton width="80%" height={24} />
    </div>
  );
}
