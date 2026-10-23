export type LoginByGoogleResponse = {
  message: string;
  accessToken: string;
};

export type SignUpByDefaultRequest = {
  user_id: string;
  password: string;
  nickname: string;
};

export type LoginByDefaultRequest = {
  user_id: string;
  password: string;
};

export type LoginByDefaultResponse = {
  isSuccess: boolean;
  message: string;
  accessToken?: string;
};

export type CheckSignUpValueResponse = {
  isExist: boolean;
  message: string;
};
