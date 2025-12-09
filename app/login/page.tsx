// This MUST be a client component because it uses interactivity (useState, onSubmit)
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); // To redirect after login
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/pantry";

  // This function will be called when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear any previous errors

    try {
      // 1. Try to sign in using the 'credentials' provider
      const result = await signIn("credentials", {
        // 2. We handle the redirect ourselves
        redirect: false,
        email,
        password,
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
    <div className="flex items-center justify-center min-w-screen min-h-full z-0">
      <Card className="w-120 max-w-screen z-10">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Display an error message if login fails */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <FieldGroup className="gap-4">
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
                <FieldLabel htmlFor="password">Password</FieldLabel>
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
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <a className="underline" href="/register">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
