import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TOKEN } from "@/lib/admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_SESSION_COOKIE)?.value !== ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: "Admin authentication required." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server." }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, miles, role, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ members: data ?? [] });
}
