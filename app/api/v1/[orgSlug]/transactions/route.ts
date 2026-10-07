import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/DBsupabase/server";
import { QueryTransactionsSchema } from "@/lib/validations/transaction";
import { hasPermission } from "@/lib/auth/rbac";
import type { Role } from "@/types/rbac";
import { ZodError } from "zod";
import { isSupabaseConfigured } from "@/lib/DBsupabase/config";

export async function GET(
  request: NextRequest,
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
    const query = QueryTransactionsSchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
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

    let requestQuery = supabase
      .from("transactions")
      .select(
        "id, amount, type, status, reference, recipient_name, recipient_account, created_at",
        { count: "exact" },
      )
      .eq("organization_id", membership.organization_id);
    if (query.status) requestQuery = requestQuery.eq("status", query.status);
    if (query.search) {
      const search = query.search.replace(/[,%()_*]/g, " ").trim();
      if (search)
        requestQuery = requestQuery.or(
          `reference.ilike.%${search}%,recipient_name.ilike.%${search}%`,
        );
    }
    const from = (query.page - 1) * query.limit;
    const { data, count, error } = await requestQuery
      .order(query.sort, { ascending: query.order === "asc" })
      .range(from, from + query.limit - 1);
    if (error) throw error;
    return NextResponse.json({
      items: data ?? [],
      total: count ?? 0,
      page: query.page,
      limit: query.limit,
    });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 422 },
      );
    console.error("GET transactions failed", error);
    return NextResponse.json(
      { error: "Unable to load transactions" },
      { status: 500 },
    );
  }
}
