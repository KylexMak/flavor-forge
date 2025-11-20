// This MUST be a client component because it uses interactivity (useState, onSubmit)
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // This is the magic function!
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LiquidEther from "@/components/LiquidEther";

export default function LoginPage() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); // To redirect after login
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // This function will be called when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear any previous errors

    try {
      // 1. Try to sign in using the 'credentials' provider
      const result = await signIn("credentials", {
        // 2. We handle the redirect ourselves
        redirect: false,
        username: email,
        password: password,
        callbackUrl,
      });

      // 3. Check if the sign-in was successful
      if (result?.ok && result.url) {
        // Login was successful!
        // Redirect to a protected page (e.g., a dashboard)
        router.push(result.url);
      } else {
        // Login failed. 'result.error' will contain the error message.
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen z-0">
      <div style={{ width: "100%", height: "100%", position: "absolute" }}>
        {/* <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        /> */}
      </div>
      <Card className="w-120 max-w-screen p-10 z-10">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {/* Display an error message if login fails */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Email</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <Field orientation="horizontal">
            <Button className="mt-5 w-full" type="submit">
              Log In
            </Button>
          </Field>
        </form>
      </Card>
    </div>
  );
}
