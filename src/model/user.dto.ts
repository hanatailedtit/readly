export type UserInfoDto = {
  id: string;
  email: string;
  profile_image: string;
  nickname: string;
  create_at: string
}

export type EditUserNicknameRequest = {
  nickname: string;
}
