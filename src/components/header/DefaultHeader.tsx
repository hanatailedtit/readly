'use client';

import {
  getLoginPage,
  getRootPage,
  getSignUpPage,
  getSummaryCreatePage,
} from '@/utils/route.utils';
import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserProfile from '../user/UserProfile/UserProfile';
import { useGetUserMyInfoQuery } from '@/service/user.service';
import Cookies from 'js-cookie';
import { useViewport } from '@/hooks/useViewport';
import { Icon } from '@iconify/react/dist/iconify.js';
import { COLORS } from '@/constants/color.constants';
import { useRef } from 'react';
import { useClickOpenOutside } from '@/hooks/useClickOpenOutside';

export default function DefaultHeader() {
  const { data, refetch } = useGetUserMyInfoQuery();
  const { isMd } = useViewport();
  const toggleRef = useRef<HTMLDivElement | null>(null);

  const { isOpen: isOpenToggle, setIsOpen: setIsOpenToggle } =
    useClickOpenOutside({ ref: toggleRef });
  const router = useRouter();

  const clickLoginButton = () => {
    router.push(getLoginPage());
  };

  const goToWriteSummary = () => {
    router.push(getSummaryCreatePage());
    setIsOpenToggle(false);
  };

  const clickSignUpButton = () => {
    router.push(getSignUpPage());
  };

  const clickLogoutButton = async () => {
    Cookies.remove('access_token');
    await refetch();
    setIsOpenToggle(false);
    router.push(getRootPage());
  };

  const clickToggleButton = () => {
    setIsOpenToggle(!isOpenToggle);
  };

  return (
    <div className="bg-main w-full h-[56px] px-[8px] flex flex-row justify-between items-center">
      <Link
        href="/"
        className="text-white text-[24px] md:text-[32px] font-bold"
      >
        READLY
      </Link>
      <div className="flex flex-row gap-x-[8px] items-center">
        {data ? (
          <>
            <UserProfile
              userId={data.id}
              userImage={data.profile_image}
              userName={data.nickname}
              textClassName="text-white font-bold"
            />
            {isMd ? (
              <div className="relative">
                <Icon
                  icon="pepicons-pop:triangle-down-filled"
                  color={COLORS.white}
                  width={25}
                  onClick={clickToggleButton}
                />
                {isOpenToggle && (
                  <div
                    className="absolute bg-white rounded-[8px] p-[8px] right-0 w-[200px] flex flex-col gap-y-[8px] shadow-lg shadow-gray/80 z-30"
                    ref={toggleRef}
                  >
                    <CommonButton onClick={goToWriteSummary} variant="outline">
                      요약 작성하기
                    </CommonButton>
                    <CommonButton onClick={clickLogoutButton} variant="outline">
                      로그아웃
                    </CommonButton>
                  </div>
                )}
              </div>
            ) : (
              <>
                <CommonButton onClick={goToWriteSummary} variant="outline">
                  요약 작성하기
                </CommonButton>
                <CommonButton onClick={clickLogoutButton} variant="outline">
                  로그아웃
                </CommonButton>
              </>
            )}
          </>
        ) : (
          <>
            <CommonButton onClick={clickLoginButton} variant="outline">
              로그인
            </CommonButton>
            <CommonButton onClick={clickSignUpButton} variant="outline">
              회원가입
            </CommonButton>
          </>
        )}
      </div>
    </div>
  );
}
