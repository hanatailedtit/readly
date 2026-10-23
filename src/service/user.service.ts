import {
  BOOK_SUMMARY_KEY,
  MY_USERS_QUERY_KEY,
  USERS_QUERY_KEY,
} from '@/constants/query-key.constants';
import { queryClient } from '@/lib/react-query';
import {
  editUserNickname,
  editUserProfileImage,
  getUserInfoData,
  getUserMyInfoData,
} from '@/repository/user.repository';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetUserInfoQuery = (id: string) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: () => getUserInfoData(id),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useGetUserMyInfoQuery = () => {
  return useQuery({
    queryKey: [MY_USERS_QUERY_KEY],
    queryFn: getUserMyInfoData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useEditUserNicknameMutation = () => {
  return useMutation({
    mutationFn: editUserNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOK_SUMMARY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_USERS_QUERY_KEY] });
    },
  });
};

export const useEditUserProfileImageMutation = () => {
  return useMutation({
    mutationFn: editUserProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOK_SUMMARY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_USERS_QUERY_KEY] });
    },
  });
};
