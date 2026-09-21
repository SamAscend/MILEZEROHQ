import { supabase } from "@/lib/supabase";
import type { Challenge, ProofSubmission } from "@/lib/challenge-store";

export type AdminMember = {
  id: string;
  name: string;
  email: string;
  miles: number;
  role: "member" | "admin";
};

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

export async function listMembersFromSupabase(): Promise<AdminMember[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, miles, role, id")
    .eq("role", "member")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((profile) => ({
    id: profile.id,
    name: profile.display_name ?? "Unnamed member",
    email: "",
    miles: profile.miles,
    role: profile.role,
  }));
}

export async function getAdminStatsFromSupabase() {
  if (!supabase) return null;

  const [members, completions, pendingProof] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "member"),
    supabase.from("challenge_completions").select("id", { count: "exact", head: true }),
    supabase.from("proof_submissions").select("id", { count: "exact", head: true }).eq("status", "Pending"),
  ]);

  if (members.error) throw members.error;
  if (completions.error) throw completions.error;
  if (pendingProof.error) throw pendingProof.error;

  return {
    activeMembers: members.count ?? 0,
    completions: completions.count ?? 0,
    pendingProof: pendingProof.count ?? 0,
    averageStreak: "0d",
  };
}

export async function listChallengesFromSupabase(): Promise<Challenge[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, frequency, category, miles_reward, requires_proof, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Challenge[];
}

export async function getChallengeFromSupabase(id: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, frequency, category, miles_reward, requires_proof, is_active, created_at")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Challenge;
}

export async function createChallengeInSupabase(input: Omit<Challenge, "id" | "created_at">) {
  if (!supabase) return null;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("You must be signed in.");

  const { data, error } = await supabase
    .from("challenges")
    .insert({ ...input, created_by: userData.user.id })
    .select("id, title, description, frequency, category, miles_reward, requires_proof, is_active, created_at")
    .single();

  if (error) throw error;
  return data as Challenge;
}

export async function updateChallengeInSupabase(id: string, updates: Partial<Challenge>) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("challenges")
    .update(updates)
    .eq("id", id)
    .select("id, title, description, frequency, category, miles_reward, requires_proof, is_active, created_at")
    .single();

  if (error) throw error;
  return data as Challenge;
}

export async function deleteChallengeFromSupabase(id: string) {
  if (!supabase) return false;

  const { error } = await supabase.from("challenges").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function submitProofToSupabase(challenge: Challenge, file: File) {
  if (!supabase) return null;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("You must be signed in.");

  const filePath = `${userData.user.id}/${crypto.randomUUID()}-${file.name}`;
  const upload = await supabase.storage.from("proofs").upload(filePath, file, { upsert: false });
  if (upload.error) throw upload.error;

  const { data, error } = await supabase
    .from("proof_submissions")
    .insert({
      challenge_id: challenge.id,
      member_id: userData.user.id,
      file_path: filePath,
      file_name: file.name,
    })
    .select("id, challenge_id, file_name, submitted_at, status")
    .single();

  if (error) throw error;
  return {
    ...data,
    challenge_title: challenge.title,
  } as ProofSubmission;
}

export async function listProofsFromSupabase(): Promise<ProofSubmission[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("proof_submissions")
    .select("id, challenge_id, file_name, submitted_at, status, challenges(title)")
    .order("submitted_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => {
    const challenge = Array.isArray(row.challenges) ? row.challenges[0] : row.challenges;
    return {
      id: row.id,
      challenge_id: row.challenge_id,
      challenge_title: challenge?.title ?? "Challenge",
      file_name: row.file_name,
      submitted_at: row.submitted_at,
      status: row.status,
    } as ProofSubmission;
  });
}

export async function updateProofStatusInSupabase(id: string, status: ProofSubmission["status"]) {
  if (!supabase) return null;

  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("proof_submissions")
    .update({ status, reviewed_by: userData.user?.id, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, challenge_id, file_name, submitted_at, status")
    .single();

  if (error) throw error;
  return data as ProofSubmission;
}
