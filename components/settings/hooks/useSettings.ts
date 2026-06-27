"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { useGetMeQuery, useUpdateProfileMutation } from "@/store/api/authApi";

type RtkError = { data?: { error?: string } };

export function useSettings() {
  const { user, login } = useAuth();
  const { toast }       = useToast();

  const { data: me }           = useGetMeQuery();
  const [updateProfile]        = useUpdateProfileMutation();
  const usesLeft               = me?.usesLeft ?? null;

  const [name,      setName]      = useState(user?.name ?? "");
  const [nameSaved, setNameSaved] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [pwLoading,  setPwLoading]  = useState(false);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name === user?.name) return;
    setNameLoading(true);
    try {
      const res = await updateProfile({ name }).unwrap();
      login(res.token, res.user);
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    } catch (err) {
      toast((err as RtkError)?.data?.error ?? "Failed to update name.", "error");
    } finally {
      setNameLoading(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw)  { toast("Passwords do not match.", "error"); return; }
    if (newPw.length < 8)     { toast("New password must be at least 8 characters.", "error"); return; }
    setPwLoading(true);
    try {
      const res = await updateProfile({ currentPassword: currentPw, newPassword: newPw }).unwrap();
      login(res.token, res.user);
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      toast("Password changed.", "success");
    } catch (err) {
      toast((err as RtkError)?.data?.error ?? "Failed to change password.", "error");
    } finally {
      setPwLoading(false);
    }
  }

  return {
    user,
    name, setName, nameLoading, nameSaved, saveName,
    currentPw, setCurrentPw,
    newPw, setNewPw,
    confirmPw, setConfirmPw,
    pwLoading, savePassword,
    usesLeft,
  };
}
