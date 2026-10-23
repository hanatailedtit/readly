import axios from "axios";
import Cookies from 'js-cookie';

export const readlyApiAxiosInstance = () => {
  const accessToken = Cookies.get('access_token') || ''
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_READLY_API_URL, headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}