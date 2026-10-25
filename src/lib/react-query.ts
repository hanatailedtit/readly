import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (count, error) =>
          count < 1 &&
          !(
            isAxiosError(error) &&
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500
          ),
      },
    },
  });
