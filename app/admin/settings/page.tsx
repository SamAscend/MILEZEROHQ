"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminSettings = {
  challengeDuration: number;
  rewardPoints: number;
  emailNewMember: boolean;
  emailReport: boolean;
  timezone: string;
  dateFormat: string;
};

const settingsKey = "milezero-admin-settings";
const defaultSettings: AdminSettings = {
  challengeDuration: 7,
  rewardPoints: 10,
  emailNewMember: true,
  emailReport: true,
  timezone: "Asia/Jakarta",
  dateFormat: "DD/MM/YYYY",
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AdminSettings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    const savedSettings = window.localStorage.getItem(settingsKey);
    if (!savedSettings) return defaultSettings;
    try {
      return { ...defaultSettings, ...JSON.parse(savedSettings) };
    } catch {
      return defaultSettings;
    }
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(() => (
    typeof window !== "undefined" && window.localStorage.getItem("milezero-admin-2fa") === "true"
  ));
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });

  const updateSetting = <Key extends keyof AdminSettings>(key: Key, value: AdminSettings[Key]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setMessage("");
  };

  const saveSettings = () => {
    window.localStorage.setItem(settingsKey, JSON.stringify(settings));
    setMessage("Platform defaults saved.");
  };

  const toggleTwoFactor = () => {
    const nextValue = !twoFactorEnabled;
    setTwoFactorEnabled(nextValue);
    window.localStorage.setItem("milezero-admin-2fa", String(nextValue));
    setMessage(nextValue ? "2FA enabled for this browser." : "2FA disabled.");
  };

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordMessage("Password admin ditentukan langsung di code. Ubah ADMIN_PASSWORD di lib/admin-auth.ts untuk menggantinya.");
    setPasswordForm({ current: "", next: "", confirm: "" });
  };

  const exportData = () => {
    const payload = { exportedAt: new Date().toISOString(), settings, twoFactorEnabled };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "milezero-admin-settings.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Settings export downloaded.");
  };

  const resetSettings = () => {
    if (!window.confirm("Reset all admin settings to their defaults?")) return;
    window.localStorage.removeItem(settingsKey);
    window.localStorage.removeItem("milezero-admin-2fa");
    setSettings(defaultSettings);
    setTwoFactorEnabled(false);
    setMessage("Admin settings reset.");
  };

  const revokeSession = async () => {
    if (!window.confirm("Revoke this admin session and return to login?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-[#0b0b0d] px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p><h1 className="mt-2 text-3xl font-black">Settings</h1></div>
          <Link href="/admin" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">Overview</Link>
        </header>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Account / Security</p>
            <h2 className="mt-2 text-2xl font-black">Protect your admin access</h2>
            <form onSubmit={handlePasswordSubmit} className="mt-6 grid gap-4 md:grid-cols-3">
              {(["current", "next", "confirm"] as const).map((field) => (
                <label key={field} className="text-sm text-zinc-300">
                  {field === "current" ? "Current password" : field === "next" ? "New password" : "Confirm password"}
                  <input type="password" value={passwordForm[field]} onChange={(event) => setPasswordForm({ ...passwordForm, [field]: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" required />
                </label>
              ))}
              <div className="md:col-span-3"><button type="submit" className="rounded-2xl bg-[#e7f27a] px-4 py-3 font-bold text-black">Save password</button>{passwordMessage && <p className="mt-3 text-sm text-amber-200">{passwordMessage}</p>}</div>
            </form>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/70 p-4"><div><p className="font-semibold">Two-factor authentication</p><p className="mt-1 text-xs text-zinc-500">Remembered for this browser.</p></div><button type="button" onClick={toggleTwoFactor} className={`rounded-full px-3 py-1 text-xs font-bold ${twoFactorEnabled ? "bg-[#e7f27a] text-black" : "bg-white/10 text-zinc-300"}`}>{twoFactorEnabled ? "On" : "Off"}</button></div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4"><p className="font-semibold">Active sessions</p><p className="mt-1 text-xs text-zinc-500">1 active session on this browser.</p><button type="button" onClick={revokeSession} className="mt-3 text-xs text-red-300 underline">Revoke current session</button></div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Platform Defaults</p><h2 className="mt-2 text-2xl font-black">Set the operating baseline</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm text-zinc-300">Default challenge duration (days)<input type="number" min="1" value={settings.challengeDuration} onChange={(event) => updateSetting("challengeDuration", Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" /></label>
              <label className="text-sm text-zinc-300">Default reward points<input type="number" min="0" value={settings.rewardPoints} onChange={(event) => updateSetting("rewardPoints", Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" /></label>
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/70 p-4 text-sm">Email alert: new member<input type="checkbox" checked={settings.emailNewMember} onChange={(event) => updateSetting("emailNewMember", event.target.checked)} className="h-4 w-4 accent-[#e7f27a]" /></label>
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/70 p-4 text-sm">Email alert: new report<input type="checkbox" checked={settings.emailReport} onChange={(event) => updateSetting("emailReport", event.target.checked)} className="h-4 w-4 accent-[#e7f27a]" /></label>
              <label className="text-sm text-zinc-300">Dashboard timezone<select value={settings.timezone} onChange={(event) => updateSetting("timezone", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"><option>Asia/Jakarta</option><option>Asia/Singapore</option><option>UTC</option><option>America/Los_Angeles</option></select></label>
              <label className="text-sm text-zinc-300">Date format<select value={settings.dateFormat} onChange={(event) => updateSetting("dateFormat", event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></label>
            </div>
            <button type="button" onClick={saveSettings} className="mt-6 rounded-2xl bg-[#e7f27a] px-4 py-3 font-bold text-black">Save platform defaults</button>{message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
          </section>

          <section className="rounded-[28px] border border-red-400/20 bg-red-400/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">Danger Zone</p><h2 className="mt-2 text-2xl font-black">Irreversible actions</h2>
            <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={exportData} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold">Export settings</button><button type="button" onClick={resetSettings} className="rounded-2xl border border-red-300/30 px-4 py-3 font-semibold text-red-200">Reset settings</button><button type="button" onClick={revokeSession} className="rounded-2xl bg-red-400 px-4 py-3 font-bold text-black">Delete admin account</button></div>
            <p className="mt-4 text-xs text-zinc-500">Delete admin account revokes this admin session. Supabase member and challenge data are not deleted from this browser action.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
