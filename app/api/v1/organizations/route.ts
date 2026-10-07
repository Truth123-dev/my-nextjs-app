import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createClient } from "@/lib/DBsupabase/server";
import { isSupabaseConfigured } from "@/lib/DBsupabase/config";
import { CreateOrganizationSchema } from "@/lib/validations/organization";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("memberships")
      .select("role, organization:organizations!inner(id, name, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (error) throw error;

    return NextResponse.json({
      items: (data ?? []).map(({ role, organization }) => ({
        ...organization,
        role,
      })),
    });
  } catch (error) {
    console.error("GET organizations failed", error);
    return NextResponse.json(
      { error: "Unable to load organizations" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  }

  try {
    const payload = CreateOrganizationSchema.parse(await request.json());
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("create_organization", {
      p_name: payload.name,
    });
    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid organization name", details: error.issues },
        { status: 422 },
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Request body must be valid JSON" },
        { status: 400 },
      );
    }
    console.error("POST organizations failed", error);
    return NextResponse.json(
      { error: "Unable to create organization" },
      { status: 500 },
    );
  }
}
