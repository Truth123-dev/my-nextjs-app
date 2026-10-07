import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/DBsupabase/server";
import { CreateTransferSchema } from "@/lib/validations/transaction";
import { hasPermission } from "@/lib/auth/rbac";
import type { Role } from "@/types/rbac";
import { ZodError } from "zod";
import { isSupabaseConfigured } from "@/lib/DBsupabase/config";

export async function POST(
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
    const payload = CreateTransferSchema.parse(await request.json());
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
      !hasPermission(membership.role as Role, "transactions:create")
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to create transfers for this organization",
        },
        { status: 403 },
      );
    }
    const { data, error } = await supabase.rpc("execute_transfer", {
      p_org_id: membership.organization_id,
      p_account_id: payload.accountId,
      p_amount: payload.amount,
      p_recipient_name: payload.recipientName,
      p_recipient_account: payload.recipientAccount,
      p_description: payload.description ?? "",
      p_reference: `TX-${crypto.randomUUID()}`,
    });
    if (error) {
      console.error("Transfer RPC failed", error);
      return NextResponse.json(
        { error: "Transfer could not be completed" },
        { status: 400 },
      );
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: "Invalid transfer details", details: error.issues },
        { status: 422 },
      );
    if (error instanceof SyntaxError)
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 },
      );
    console.error("POST transfer failed", error);
    return NextResponse.json(
      { error: "Unable to create transfer" },
      { status: 500 },
    );
  }
}
