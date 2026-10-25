"use client";

import { createQueryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";

type ProviderProps = {
  children: ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  const [queryClient] = useState(createQueryClient);
  useEffect(() => {
    const root = document.documentElement;
    const pointer = () => {
      if (root.dataset.inputModality !== "pointer")
        root.dataset.inputModality = "pointer";
    };
    const keyboard = () => {
      if (root.dataset.inputModality !== "keyboard")
        root.dataset.inputModality = "keyboard";
    };
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("keydown", keyboard, true);
    return () => {
      document.removeEventListener("pointerdown", pointer, true);
      document.removeEventListener("keydown", keyboard, true);
      delete root.dataset.inputModality;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
