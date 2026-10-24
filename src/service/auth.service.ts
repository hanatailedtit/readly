import { MY_USERS_QUERY_KEY } from "@/constants/query-key.constants";
import { queryClient } from "@/lib/react-query";
import {
  checkSignUpId,
  checkSignUpNickname,
  loginByDefault,
  loginByGoogle,
  signUpByDefault,
} from "@/repository/auth.repository";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const useLoginByGoogleMutation = () => {
  return useMutation({
    mutationFn: loginByGoogle,
    onSuccess: (res) => {
      Cookies.set("access_token", String(res.accessToken), {
        sameSite: "Strict",
        expires: 1,
        secure: true,
      });
      queryClient.setQueryData([MY_USERS_QUERY_KEY], null);
      queryClient.invalidateQueries();
    },
  });
};

export const useSignUpByDefaultMutation = () => {
  return useMutation({
    mutationFn: signUpByDefault,
  });
};

export const useCheckSignUpIdMutation = () => {
  return useMutation({
    mutationFn: checkSignUpId,
  });
};

export const useCheckSignUpNicknameMutation = () => {
  return useMutation({
    mutationFn: checkSignUpNickname,
  });
};

export const useLoginByDefaultMutation = () => {
  return useMutation({
    mutationFn: loginByDefault,
    onSuccess: (res) => {
      if (!res.isSuccess) return;
      Cookies.set("access_token", String(res.accessToken), {
        sameSite: "Strict",
        expires: 1,
        secure: true,
      });
      queryClient.setQueryData([MY_USERS_QUERY_KEY], null);
      queryClient.invalidateQueries();
    },
  });
};
