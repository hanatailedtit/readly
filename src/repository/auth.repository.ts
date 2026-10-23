import { readlyApiAxiosInstance } from '@/api/readly-api';
import {
  CheckSignUpValueResponse,
  LoginByDefaultRequest,
  LoginByDefaultResponse,
  LoginByGoogleResponse,
  SignUpByDefaultRequest,
} from '@/model/auth.dto';

export const loginByGoogle = async (
  code: string,
): Promise<LoginByGoogleResponse> => {
  const { data } = await readlyApiAxiosInstance().post('/auth/login/google', {
    code,
  });
  return data;
};

export const signUpByDefault = async (params: SignUpByDefaultRequest) => {
  await readlyApiAxiosInstance().post('/auth/sign-up', params);
};

export const checkSignUpId = async (
  params: Pick<SignUpByDefaultRequest, 'user_id'>,
) => {
  const { data } =
    await readlyApiAxiosInstance().post<CheckSignUpValueResponse>(
      '/auth/sign-up/id-check',
      params,
    );

  return data;
};

export const checkSignUpNickname = async (
  params: Pick<SignUpByDefaultRequest, 'nickname'>,
) => {
  const { data } =
    await readlyApiAxiosInstance().post<CheckSignUpValueResponse>(
      '/auth/sign-up/nickname-check',
      params,
    );

  return data;
};

export const loginByDefault = async (params: LoginByDefaultRequest) => {
  const { data } = await readlyApiAxiosInstance().post<LoginByDefaultResponse>(
    '/auth/login',
    params,
  );

  return data;
};
