import CommonSkeleton from '@/components/ui/skeleton/CommonSkeleton';

export default function BookSummaryListSkeleton() {
  const skeletonHeight = 298;
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-3 gap-x-[16px] gap-y-[16px] w-full">
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
      <CommonSkeleton height={skeletonHeight} />
    </div>
  );
}
