import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/DBsupabase/server";
import { isSupabaseConfigured } from "@/lib/DBsupabase/config";
import { hasPermission } from "@/lib/auth/rbac";
import type { Role } from "@/types/rbac";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orgSlug: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  }

  try {
    const { orgSlug } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .select("role, organization_id, organizations!inner(slug)")
      .eq("organizations.slug", orgSlug)
      .eq("user_id", user.id)
      .maybeSingle();
    if (membershipError) throw membershipError;
    if (
      !membership ||
      !hasPermission(membership.role as Role, "transactions:read")
    ) {
      return NextResponse.json(
        { error: "Organization forbidden" },
        { status: 403 },
      );
    }

    const { data, error } = await supabase.rpc("get_organization_analytics", {
      p_org_id: membership.organization_id,
    });
    if (error) throw error;

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    console.error("GET analytics failed", error);
    return NextResponse.json(
      { error: "Unable to load analytics" },
      { status: 500 },
    );
  }
}
