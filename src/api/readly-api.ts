import axios from "axios";
import Cookies from "js-cookie";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_READLY_API_URL,
  timeout: 15_000,
});
client.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  else config.headers.delete("Authorization");
  return config;
});

export const readlyApiAxiosInstance = () => client;
