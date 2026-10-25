import {
  MY_USERS_QUERY_KEY,
  isSessionQuery,
} from "@/constants/query-key.constants";
import {
  checkSignUpId,
  checkSignUpNickname,
  loginByDefault,
  loginByGoogle,
  signUpByDefault,
} from "@/repository/auth.repository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const useLoginByGoogleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginByGoogle,
    onSuccess: async (res) => {
      Cookies.set("access_token", String(res.accessToken), {
        sameSite: "Strict",
        expires: 1,
        secure: true,
      });
      await queryClient.cancelQueries({ predicate: isSessionQuery });
      queryClient.setQueryData([MY_USERS_QUERY_KEY], null);
      await queryClient.invalidateQueries({
        predicate: (query) =>
          isSessionQuery(query) && query.queryKey[1] !== "recent",
      });
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginByDefault,
    onSuccess: async (res) => {
      if (!res.isSuccess) return;
      Cookies.set("access_token", String(res.accessToken), {
        sameSite: "Strict",
        expires: 1,
        secure: true,
      });
      await queryClient.cancelQueries({ predicate: isSessionQuery });
      queryClient.setQueryData([MY_USERS_QUERY_KEY], null);
      await queryClient.invalidateQueries({
        predicate: (query) =>
          isSessionQuery(query) && query.queryKey[1] !== "recent",
      });
    },
  });
};
