'use client';

import { COLORS } from '@/constants/color.constants';
import {
  useLoginByDefaultMutation,
  useLoginByGoogleMutation,
} from '@/service/auth.service';
import { getRootPage } from '@/utils/route.utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useGoogleLogin } from '@react-oauth/google';
import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import CommonInput from '@/components/ui/input/CommonInput/CommonInput';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  id: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const {
    mutateAsync: defaultMutate,
    data: loginData,
    isPending: isDefaultPending,
  } = useLoginByDefaultMutation();
  const { mutateAsync: googleMutate } = useLoginByGoogleMutation();
  const message = useMemo(() => loginData?.message, [loginData?.message]);

  const submitLoginData: SubmitHandler<Inputs> = async (data) => {
    const mutate = await defaultMutate({
      password: data.password,
      user_id: data.id,
    });

    if (mutate.isSuccess) {
      router.push(getRootPage());
    }
  };

  const clickGoogleLoginButton = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await googleMutate(tokenResponse.code);
      router.push(getRootPage());
    },
    flow: 'auth-code',
  });

  return (
    <div className="w-full flex flex-col items-center">
      <form
        className="w-full sm:w-[400px] flex flex-col gap-y-[26px]"
        onSubmit={handleSubmit(submitLoginData)}
      >
        <h1 className="text-lg font-bold">로그인</h1>
        <CommonInput
          placeholder="아이디"
          {...register('id', { required: '아이디를 입력해주세요.' })}
          alertText={errors.id?.message}
        />
        <CommonInput
          placeholder="비밀번호"
          {...register('password', { required: '비밀번호를 입력해주세요.' })}
          alertText={errors.password?.message}
          type="password"
        />
        {message && <p className="text-red">{message}</p>}
        <div className="flex flex-col gap-y-[16px]">
          <CommonButton
            type="submit"
            className="bg-main border-transparent text-[18px] text-white font-bold"
            isLoading={isDefaultPending}
            loadingColor={COLORS.white}
          >
            로그인
          </CommonButton>
          <CommonButton
            className="text-[18px] font-bold"
            onClick={clickGoogleLoginButton}
          >
            <Icon icon="devicon:google" />
            구글 로그인
          </CommonButton>
        </div>
      </form>
    </div>
  );
}
