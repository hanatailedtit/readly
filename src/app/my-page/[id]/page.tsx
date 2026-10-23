'use client';

import BookSummaryList from '@/components/book/BookSummaryList/BookSummaryList';
import MyPageProfileSkeleton from '@/components/skeleton/my-page/MyPageProfileSkeleton';
import { COLORS } from '@/constants/color.constants';
import { useGetBookSummaryListQuery } from '@/service/book.service';
import {
  useEditUserNicknameMutation,
  useEditUserProfileImageMutation,
  useGetUserInfoQuery,
} from '@/service/user.service';
import { Icon } from '@iconify/react/dist/iconify.js';
import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import CommonFileInput from '@/components/ui/input/CommonFileInput/CommonFileInput';
import CommonInput from '@/components/ui/input/CommonInput/CommonInput';
import ProfileImage from '@/components/ui/image/ProfileImage/ProfileImage';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function MyPage() {
  const { id } = useParams();
  const [nickname, setNickname] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isOpenNicknameInput, setIsOpenNicknameInput] = useState(false);
  const [isOpenFileInput, setIsOpenFileInput] = useState(false);
  const [nicknameAlertMessage, setNicknameAlertMessage] = useState('');

  const { data: infoData, isFetching: infoFetching } = useGetUserInfoQuery(
    String(id),
  );
  const {
    data: myListData,
    isFetching: listFetching,
    fetchNextPage,
  } = useGetBookSummaryListQuery({
    user_id: String(id),
  });
  const { mutateAsync: nicknameMutate, isPending: nicknamePending } =
    useEditUserNicknameMutation();
  const { mutateAsync: imageMutate, isPending: imagePending } =
    useEditUserProfileImageMutation();

  const clickEditNicknameButton = () => {
    setIsOpenNicknameInput(!isOpenNicknameInput);
  };

  const clickEditFileButton = () => {
    setIsOpenFileInput(!isOpenFileInput);
  };

  const clickEnterEditNickname = async () => {
    setNicknameAlertMessage('');

    if (nickname.length <= 1) {
      setNicknameAlertMessage('닉네임을 2자 이상 입력해주세요.');
      return;
    }

    if (nickname.length > 8) {
      setNicknameAlertMessage('닉네임을 8자 이하로 입력해주세요.');
      return;
    }

    await nicknameMutate({ nickname });
    setIsOpenNicknameInput(false);
  };

  const clickEnterEditProfile = async () => {
    if (!files) return;

    const image = files[0];

    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    await imageMutate(formData);
    setIsOpenFileInput(false);
  };

  return (
    <div className="flex flex-col items-center gap-y-[16px]">
      {infoFetching && <MyPageProfileSkeleton />}
      {!infoFetching && infoData && (
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-row items-end relative mb-[16px]">
            <ProfileImage imageSrc={infoData?.profile_image} size="xLarge" />
            {infoData?.is_my && (
              <CommonButton
                className={[
                  'rounded-full w-[24px] h-[24px] p-0 absolute right-[-16px]',
                  isOpenFileInput && 'bg-main',
                  isOpenFileInput && 'border-transparent',
                ]}
                onClick={clickEditFileButton}
                variant="outline"
              >
                <Icon
                  icon="mingcute:pencil-fill"
                  color={isOpenFileInput ? COLORS.white : COLORS.black}
                />
              </CommonButton>
            )}
          </div>
          {isOpenFileInput && (
            <div className="flex flex-row gap-x-[16px]">
              <CommonFileInput value={files} onChangeValue={setFiles} />
              <CommonButton
                onClick={clickEnterEditProfile}
                isLoading={imagePending}
              >
                수정
              </CommonButton>
            </div>
          )}

          <div className="flex flex-col items-center gap-y-[16px] relative">
            <div className="flex flex-row gap-x-[8px] items-center">
              <p className="text-lg">{infoData?.nickname}</p>
              {infoData?.is_my && (
                <CommonButton
                  className={[
                    'rounded-full w-[24px] h-[24px] p-0 absolute right-[-32px] bottom-0',
                    isOpenNicknameInput && 'bg-main',
                    isOpenNicknameInput && 'border-transparent',
                  ]}
                  variant="outline"
                  onClick={clickEditNicknameButton}
                >
                  <Icon
                    icon="mingcute:pencil-fill"
                    color={isOpenNicknameInput ? COLORS.white : COLORS.black}
                  />
                </CommonButton>
              )}
            </div>
          </div>
          {isOpenNicknameInput && (
            <div className="flex flex-row gap-x-[16px] mt-[16px]">
              <CommonInput
                className="flex-1"
                placeholder="수정할 닉네임"
                onChangeValue={setNickname}
                alertText={nicknameAlertMessage}
              />
              <CommonButton
                onClick={clickEnterEditNickname}
                isLoading={nicknamePending}
              >
                수정
              </CommonButton>
            </div>
          )}
        </div>
      )}

      <div className="w-full">
        <h1 className="text-lg mb-[16px]">작성글</h1>
        <BookSummaryList
          data={myListData?.pages.flatMap((item) => item.data) || null}
          isFetching={listFetching}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
}
