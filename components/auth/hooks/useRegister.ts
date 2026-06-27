"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useRegisterMutation } from "@/store/api/authApi";

type RtkError = { data?: { error?: string } };

export function useRegister() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");

  const { login }              = useAuth();
  const router                 = useRouter();
  const [registerMutation, { isLoading: loading }] = useRegisterMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await registerMutation({ name, email, password }).unwrap();
      login(data.token, data.user);
      router.replace("/dashboard");
    } catch (err) {
      setError((err as RtkError)?.data?.error ?? "Registration failed.");
    }
  }

  return { name, setName, email, setEmail, password, setPassword, showPw, setShowPw, error, loading, handleSubmit };
}
