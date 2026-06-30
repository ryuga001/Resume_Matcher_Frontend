"use client";

import { useSettings } from "@/components/settings/hooks/useSettings";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { PlanSection } from "@/components/settings/PlanSection";
import { SettingsFooter } from "@/components/settings/SettingsFooter";
import { AppearanceSection } from "@/components/settings/AppearanceSection";

export function SettingsPage() {
  const {
    user,
    name, setName, nameLoading, nameSaved, saveName,
    currentPw, setCurrentPw,
    newPw, setNewPw,
    confirmPw, setConfirmPw,
    pwLoading, savePassword,
    usesLeft,
  } = useSettings();

  return (
    <div className="px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="font-heading text-2xl font-bold" style={{ color: "#2a2826" }}>Account Settings</h1>
          <p className="text-sm mt-1" style={{ color: "#6e6862" }}>Manage your profile, security, and plan preferences.</p>
        </header>
        <div className="space-y-6">
          <ProfileSection
            user={user}
            name={name}
            setName={setName}
            nameLoading={nameLoading}
            nameSaved={nameSaved}
            onSave={saveName}
          />
          <SecuritySection
            currentPw={currentPw}
            newPw={newPw}
            confirmPw={confirmPw}
            setCurrentPw={setCurrentPw}
            setNewPw={setNewPw}
            setConfirmPw={setConfirmPw}
            pwLoading={pwLoading}
            onSave={savePassword}
          />
          <AppearanceSection />
          <PlanSection usesLeft={usesLeft} />
        </div>
        <SettingsFooter />
      </div>
    </div>
  );
}
