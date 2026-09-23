import { supabase } from "@/lib/supabase";
import type { Challenge, ProofSubmission } from "@/lib/challenge-store";

export type AdminMember = {
  id: string;
  name: string;
  email: string;
  miles: number;
  role: "member" | "admin";
};

export type CurrentProfile = {
  id: string;
  display_name: string;
  username: string;
  bio: string;
  avatar_url: string | null;
  miles: number;
  role: "member" | "admin";
  email: string;
  created_at: string;
  challenge_count: number;
};

const profileSelect = "id, display_name, username, bio, avatar_url, miles, role, created_at";

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

async function ensureProfile(user: { id: string; email?: string | null }) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: user.email ?? "Runner",
    }, { onConflict: "id", ignoreDuplicates: true })
    .select(profileSelect)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  if (!supabase) return null;

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) return null;

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", authData.user.id)
    .maybeSingle();

  if (error) throw error;
  let data = profileData;
  if (!data) {
    data = await ensureProfile(authData.user);
  }
  if (!data) return null;

  return {
    ...data,
    display_name: data.display_name ?? "",
    username: data.username ?? "",
    bio: data.bio ?? "",
    email: authData.user.email ?? "",
    challenge_count: 0,
  } as CurrentProfile;
}

export async function getPublicProfile(id: string): Promise<CurrentProfile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { data: count, error: countError } = await supabase.rpc("get_profile_challenge_count", { profile_id: id });
  if (countError) throw countError;

  return {
    ...data,
    display_name: data.display_name ?? "",
    username: data.username ?? "",
    bio: data.bio ?? "",
    email: "",
    challenge_count: count ?? 0,
  } as CurrentProfile;
}

export async function listPublicProfiles() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, miles, role, created_at")
    .order("miles", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function uploadProfileAvatar(file: File, userId: string) {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
  if (!file.type.startsWith("image/")) throw new Error("File avatar harus berupa gambar.");
  if (file.size > 2 * 1024 * 1024) throw new Error("Ukuran avatar maksimal 2MB.");

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const element = new Image();
    element.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(element);
    };
    element.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Avatar tidak dapat dibaca."));
    };
    element.src = objectUrl;
  });

  const size = Math.min(1024, Math.max(image.naturalWidth, image.naturalHeight));
  const scale = size / Math.max(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);

  const compressed = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Avatar gagal dikompres."))), "image/jpeg", 0.82);
  });
  if (compressed.size > 2 * 1024 * 1024) throw new Error("Avatar hasil kompresi masih terlalu besar.");

  const filePath = `${userId}/avatar.jpg`;
  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, compressed, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (uploadError) throw uploadError;

  return supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;
}

export async function updateCurrentProfile(updates: Pick<CurrentProfile, "display_name" | "username" | "bio" | "avatar_url">) {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error("Silakan login terlebih dahulu.");

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", authData.user.id)
    .select("id, display_name, username, bio, avatar_url, miles, role")
    .single();

  if (error) throw error;
  return data;
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
