"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLoginMutation } from "@/store/api/authApi";

type RtkError = { data?: { error?: string } };

export function useLogin() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");

  const { login }            = useAuth();
  const router               = useRouter();
  const [loginMutation, { isLoading: loading }] = useLoginMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await loginMutation({ email, password }).unwrap();
      login(data.user);
      router.replace("/dashboard");
    } catch (err) {
      setError((err as RtkError)?.data?.error ?? "Login failed.");
    }
  }

  return { email, setEmail, password, setPassword, showPw, setShowPw, error, loading, handleSubmit };
}
