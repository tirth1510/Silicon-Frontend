"use client";

import { useMutation } from "@tanstack/react-query";
import { loginService } from "@/services/auth.service";

export function useLogin() {
  return useMutation({
    mutationFn: loginService,
  });
}
