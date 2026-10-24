"use client";

import { queryClient } from "@/lib/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={googleClientId}>
        {children}
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
