import { readlyApiAxiosInstance } from "@/api/readly-api"
import { EditUserNicknameRequest, UserInfoDto } from "@/model/user.dto"

export const getUserInfoData = async (id: string) => {
  const { data } = await readlyApiAxiosInstance().get<UserInfoDto & { is_my: boolean }>('/user/info', { params: { user_id: id } })
  return data
}

export const getUserMyInfoData = async () => {
  const { data } = await readlyApiAxiosInstance().get<UserInfoDto>('/user/my-info')
  return data
}

export const editUserNickname = async (params: EditUserNicknameRequest) => {
  await readlyApiAxiosInstance().put('/user/edit/nickname', params)
}

export const editUserProfileImage = async (params: FormData) => {
  await readlyApiAxiosInstance().post('/user/edit/profile-image', params, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
}