import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function DELETE(req: Request) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get User ID
    const { data: userRecord } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get Pantry ID
    const { data: pantryData } = await supabase
      .schema("public")
      .from("user_pantry")
      .select("id")
      .eq("user_id", userRecord.id)
      .single();

    if (!pantryData) {
      return NextResponse.json({ error: "Pantry not found" }, { status: 404 });
    }

    // 4. Get the Ingredient ID from the URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Ingredient ID is required" }, { status: 400 });
    }

    // 5. Delete the Row
    // We match BOTH user_pantry_id and ingredient_id to ensure we delete the correct link
    const { error } = await supabase
      .schema("public")
      .from("user_pantry_ingredient")
      .delete()
      .eq("user_pantry_id", pantryData.id)
      .eq("ingredient_id", id);

    if (error) {
      console.error("Supabase Delete Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}