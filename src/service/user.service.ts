import {
  BOOK_SUMMARY_KEY,
  MY_USERS_QUERY_KEY,
  USERS_QUERY_KEY,
  COMMENT_KEY,
} from "@/constants/query-key.constants";
import {
  editUserNickname,
  editUserProfileImage,
  getUserInfoData,
  getUserMyInfoData,
} from "@/repository/user.repository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const useGetUserInfoQuery = (id: string) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: ({ signal }) => getUserInfoData(id, signal),
    staleTime: Infinity,
  });
};

export const useGetUserMyInfoQuery = () => {
  return useQuery({
    queryKey: [MY_USERS_QUERY_KEY],
    queryFn: ({ signal }) =>
      Cookies.get("access_token") ? getUserMyInfoData(signal) : null,
    enabled: !!Cookies.get("access_token"),
    retry: false,
    staleTime: Infinity,
  });
};

const invalidateProfileQueries = (client: QueryClient) =>
  Promise.all(
    [BOOK_SUMMARY_KEY, USERS_QUERY_KEY, MY_USERS_QUERY_KEY, COMMENT_KEY].map(
      (key) => client.invalidateQueries({ queryKey: [key] }),
    ),
  );

export const useEditUserNicknameMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editUserNickname,
    onSuccess: () => invalidateProfileQueries(queryClient),
  });
};

export const useEditUserProfileImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editUserProfileImage,
    onSuccess: () => invalidateProfileQueries(queryClient),
  });
};
