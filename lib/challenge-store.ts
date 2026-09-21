export type ChallengeFrequency = "Daily" | "Weekly" | "Monthly" | "Special";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  frequency: ChallengeFrequency;
  category: string;
  miles_reward: number;
  requires_proof: boolean;
  is_active: boolean;
  created_at: string;
};

export type ProofSubmission = {
  id: string;
  challenge_id: string;
  challenge_title: string;
  file_name: string;
  submitted_at: string;
  status: "Pending" | "Approved" | "Rejected";
};

const STORAGE_KEY = "milezero-challenges";
const PROOFS_STORAGE_KEY = "milezero-proof-submissions";

export const defaultChallenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "5K Easy Run",
    description: "Complete a relaxed 5 kilometer run with a steady pace.",
    frequency: "Daily",
    category: "Lari",
    miles_reward: 18,
    requires_proof: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "challenge-2",
    title: "30 Push-ups",
    description: "Finish 30 push-ups in one set or across a short workout block.",
    frequency: "Daily",
    category: "Gym",
    miles_reward: 10,
    requires_proof: false,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "challenge-3",
    title: "Total 25 km",
    description: "Reach a total of 25 kilometers in the current week.",
    frequency: "Weekly",
    category: "Lari",
    miles_reward: 30,
    requires_proof: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "challenge-4",
    title: "Crew Sprint Race",
    description: "Take part in the crew sprint race event and share proof.",
    frequency: "Special",
    category: "Event",
    miles_reward: 40,
    requires_proof: true,
    is_active: false,
    created_at: new Date().toISOString(),
  },
];

export function getStoredChallenges(): Challenge[] {
  if (typeof window === "undefined") return defaultChallenges;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultChallenges));
      return defaultChallenges;
    }

    const parsed = JSON.parse(raw) as Challenge[];
    return parsed.length ? parsed : defaultChallenges;
  } catch {
    return defaultChallenges;
  }
}

export function saveChallenges(challenges: Challenge[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
}

export function createChallenge(input: Omit<Challenge, "id" | "created_at">) {
  const challenges = getStoredChallenges();
  const nextChallenge: Challenge = {
    ...input,
    id: `challenge-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const nextChallenges = [nextChallenge, ...challenges];
  saveChallenges(nextChallenges);
  return nextChallenge;
}

export function updateChallenge(id: string, updates: Partial<Challenge>) {
  const challenges = getStoredChallenges();
  const nextChallenges = challenges.map((challenge) =>
    challenge.id === id ? { ...challenge, ...updates } : challenge,
  );

  saveChallenges(nextChallenges);
  return nextChallenges.find((challenge) => challenge.id === id) ?? null;
}

export function deleteChallenge(id: string) {
  const challenges = getStoredChallenges();
  const nextChallenges = challenges.filter((challenge) => challenge.id !== id);
  saveChallenges(nextChallenges);
  return nextChallenges;
}

export function getChallengeById(id: string) {
  const challenges = getStoredChallenges();
  return challenges.find((item) => item.id === id) ?? null;
}

export function getProofSubmissions(): ProofSubmission[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(PROOFS_STORAGE_KEY) ?? "[]") as ProofSubmission[];
  } catch {
    return [];
  }
}

export function saveProofSubmissions(submissions: ProofSubmission[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROOFS_STORAGE_KEY, JSON.stringify(submissions));
}

export function createProofSubmission(input: Omit<ProofSubmission, "id" | "submitted_at" | "status">) {
  const submissions = getProofSubmissions();
  const submission: ProofSubmission = {
    ...input,
    id: `proof-${Date.now()}`,
    submitted_at: new Date().toISOString(),
    status: "Pending",
  };

  saveProofSubmissions([submission, ...submissions]);
  return submission;
}

export function updateProofStatus(id: string, status: ProofSubmission["status"]) {
  const submissions = getProofSubmissions();
  const updated = submissions.map((submission) => (submission.id === id ? { ...submission, status } : submission));
  saveProofSubmissions(updated);
  return updated;
}
