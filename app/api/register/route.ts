import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (SUPABASE_URL === undefined || SUPABASE_SERVICE_ROLE_KEY === undefined) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables"
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .schema("next_auth")
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert into Supabase Adapter table
    // Note: We also set 'emailVerified' to null or a date if you want to skip verification
    const { data: newUser, error } = await supabase
      .schema("next_auth")
      .from("users")
      .insert({
        email,
        name,
        passwordHash: hashedPassword, // Storing the hash in our custom column
        emailVerified: new Date(), // Auto-verify for credentials if desired
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    const {data: newPantry, error: secondTableError} = await supabase
        .from("user_pantry")
        .insert({user_Id: newUser.id})
        .select()
        .single();

    if (secondTableError) {
      throw secondTableError;
    }

    return NextResponse.json(newUser);
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
