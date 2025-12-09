import {createClient} from "@supabase/supabase-js";
import {NextResponse} from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: Request) {
  try {

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session User:", session.user);
    console.log("Session User Email:", session.user.email);

    const { data: userRecord } = await supabase
    .schema("next_auth")
    .from("users") // Assuming NextAuth Adapter stores users here
    .select("id")
    .eq("email", session.user.email)
    .single();

    console.log("User Record:", userRecord?.id);

    if (!userRecord) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, quantity, unit } = body;

    // 1. Basic Validation
    if (!name || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields (name, quantity, unit)" },
        { status: 400 }
      );
    }

    const { data: pantryData, error: pantryError } = await supabase
        .schema("public")
        .from("user_pantry")
        .select("id")
        .eq("user_id", userRecord.id)
        .single();

    if (pantryError || !pantryData) {
        // Optional: Auto-create a pantry if one doesn't exist?
        return NextResponse.json({ error: "Pantry not found for user" }, { status: 404 });
    }

    const pantryId = pantryData.id;

    let { data: ingredient } = await supabase
        .from("ingredients")
        .select("id")
        .eq("name", name)
        .maybeSingle();
    
    console.log("Ingredient ID:", ingredient?.id);

    if(!ingredient){
        const { data: newIngredient, error: createError } = await supabase
        .from("ingredient")
        .insert({ name })
        .select("id")
        .single();

        if (createError) {
            console.error("Error creating ingredient:", createError);
            return NextResponse.json({ error: "Failed to create ingredient" }, { status: 500 });
        }

        ingredient = newIngredient;
        console.log("Ingredient ID:", ingredient?.id);

    }


    // 2. Insert into Supabase
    // .select() is important: it returns the newly created row so you can use it immediately
    const { data, error } = await supabase
      .from("user_pantry_ingredient")
      .insert([
        {
            ingredient_id: ingredient!.id,
            user_pantry_id: pantryId,
            amount: quantity,
            unit,
        }
        ]) // Supabase expects an array of objects
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Ingredient added", data }, { status: 201 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}