import { getMyPage } from '@/utils/route.utils';
import ProfileImage from '@/components/ui/image/ProfileImage/ProfileImage';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';
import { ClassNameValue, twMerge } from 'tailwind-merge';

type UserProfileProps = {
  userImage: string;
  userName: string;
  userId: string;
  textClassName?: ClassNameValue;
};

export default function UserProfile({
  userImage,
  userName,
  userId,
  textClassName,
}: UserProfileProps) {
  const router = useRouter();

  const handleClickUserProfile = (e: MouseEvent) => {
    e.preventDefault();
    router.push(getMyPage(userId));
  };

  const pClassName = twMerge('text-md', textClassName);
  return (
    <div
      className="flex flex-row gap-x-[8px] items-center justify-end cursor-pointer hover:opacity-60"
      onClick={handleClickUserProfile}
    >
      <ProfileImage imageSrc={userImage} />
      <p className={pClassName}>{userName}</p>
    </div>
  );
}
