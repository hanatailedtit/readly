'use client';

import { COLORS } from '@/constants/color.constants';
import {
  useCheckSignUpIdMutation,
  useSignUpByDefaultMutation,
} from '@/service/auth.service';
import { getLoginPage } from '@/utils/route.utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import CommonButton from '@/components/ui/button/CommonButton/CommonButton';
import CommonInput from '@/components/ui/input/CommonInput/CommonInput';
import { debounce } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  id: string;
  password: string;
  verifyPassword: string;
  nickname: string;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutateAsync: signUpMutate } = useSignUpByDefaultMutation();
  const {
    mutateAsync: idMutate,
    data: idData,
    isPending: isIdPending,
  } = useCheckSignUpIdMutation();
  const router = useRouter();

  const idCheckIcon = useMemo(() => {
    if (isIdPending)
      return (
        <Icon icon="line-md:loading-loop" color={COLORS.main} width={20} />
      );

    if (!idData) return undefined;

    return idData.isExist ? (
      <Icon icon="mingcute:close-fill" color={COLORS.red} />
    ) : (
      <Icon icon="mingcute:check-fill" color={COLORS.green} />
    );
  }, [idData, isIdPending]);

  const checkExistId = debounce((e: InputEvent) => {
    const element = e.target as HTMLInputElement;
    if (!element.value) return;
    idMutate({ user_id: element.value });
  }, 350);

  const replaceInputValue = (e: InputEvent) => {
    const element = e.target as HTMLInputElement;
    element.value = element.value.replace(/[^A-Za-z0-9]+$/gi, '');
  };

  const submitSignUpData: SubmitHandler<Inputs> = async (data) => {
    await signUpMutate({
      nickname: data.nickname,
      password: data.password,
      user_id: data.id,
    });
    router.push(getLoginPage());
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={handleSubmit(submitSignUpData)}
        className="flex flex-col gap-y-[26px] w-full sm:w-[400px]"
      >
        <h1 className="text-lg font-bold">회원가입</h1>
        <CommonInput
          placeholder="아이디"
          {...register('id', {
            required: '아이디는 필수 입력값 입니다.',
            onChange: (e) => {
              replaceInputValue(e);
              checkExistId(e);
            },
            minLength: {
              value: 6,
              message: '아이디는 6자 이상 입력하여야 합니다.',
            },
            validate: () => !idData?.isExist || '중복된 아이디 입니다.',
          })}
          alertText={errors.id?.message}
          rightIcon={idCheckIcon}
        />
        <CommonInput
          placeholder="비밀번호"
          {...register('password', {
            minLength: {
              value: 8,
              message: '비밀번호는 8자 이상 입력하여야 합니다.',
            },
            required: '비밀번호는 필수 입력값 입니다.',
            onChange: replaceInputValue,
          })}
          alertText={errors.password?.message}
          type="password"
        />
        <CommonInput
          placeholder="비밀번호 확인"
          {...register('verifyPassword', {
            required: '비밀번호 확인은 필수 입력값 입니다.',
            validate: (value, formValues) =>
              value === formValues.password || '비밀번호가 일치하지 않습니다.',
            onChange: replaceInputValue,
          })}
          alertText={errors.verifyPassword?.message}
          type="password"
        />
        <CommonInput
          placeholder="닉네임"
          {...register('nickname', {
            required: '닉네임은 필수 입력값 입니다.',
            maxLength: {
              value: 8,
              message: '닉네임은 8자 이하로 입력가능합니다.',
            },
          })}
          alertText={errors.nickname?.message}
        />
        <CommonButton
          type="submit"
          className="bg-main border-transparent text-[18px] text-white font-bold"
        >
          회원가입
        </CommonButton>
      </form>
    </div>
  );
}
