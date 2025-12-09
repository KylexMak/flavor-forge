import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Initialize Supabase with Service Role Key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function PATCH(req: Request) {
  try {
    // 1. Authenticate the User
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

    // 4. Parse Request Body
    const body = await req.json();
    console.log("Request Body:", body);
    // Note: The frontend sends 'id' which is actually the ingredient_id
    const { id, name, quantity, unit } = body; 

    // 5. Update the specific row
    // We match on BOTH user_pantry_id AND ingredient_id
    const { error } = await supabase
      .schema("public")
      .from("user_pantry_ingredient") // Correct singular table name
      .update({
        amount: quantity, // Map 'quantity' (Frontend) -> 'amount' (DB)
        unit: unit,
      })
      .eq("user_pantry_id", pantryData.id) 
      .eq("ingredient_id", id);

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}