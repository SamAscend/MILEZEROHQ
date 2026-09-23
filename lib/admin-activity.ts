export type AdminActivity = {
  id: string;
  kind: "login" | "audit";
  actor: string;
  action: string;
  device: string;
  createdAt: string;
};

const ACTIVITY_KEY = "milezero-admin-activity";

export function getAdminActivity(): AdminActivity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(ACTIVITY_KEY) ?? "[]") as AdminActivity[];
  } catch {
    return [];
  }
}

export function recordAdminActivity(activity: Omit<AdminActivity, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const nextActivity: AdminActivity = {
    ...activity,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify([nextActivity, ...getAdminActivity()].slice(0, 100)));
}
