import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path if needed

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET() {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get User ID (from NextAuth Users table)
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
      // If no pantry exists, return an empty list (not a 404)
      return NextResponse.json({ ingredients: [] }, { status: 200 });
    }

    // 4. Fetch Ingredients (With JOIN)
    // We select the row ID (for deletion), amount, unit, AND the name from the linked table
    const { data: rawIngredients, error } = await supabase
      .from("user_pantry_ingredient")
      .select(`
        user_pantry_id,
        amount,
        unit,
        ingredient (
          id,
          name
        )
      `)
      .eq("user_pantry_id", pantryData.id);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Raw Ingredients Data:", rawIngredients);
    // 5. Transform Data
    // The DB returns nested data: { amount: 5, ingredients: { name: "Flour" } }
    // The Frontend wants flat data: { quantity: 5, name: "Flour" }
    const formattedIngredients = rawIngredients.map((item: any) => ({
      id: item.ingredient.id, // The ID of the row in 'user_pantry_ingredients' (used for deleting)
      name: item.ingredient?.name || "Unknown", // Handle potential missing names
      quantity: item.amount, // Map 'amount' (DB) to 'quantity' (Frontend)
      unit: item.unit,
    }));

    return NextResponse.json({ ingredients: formattedIngredients }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}