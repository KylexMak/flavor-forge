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
import { EyeIcon, EyeOffIcon } from "lucide-react";

const RegisterPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const router = useRouter(); // To redirect after login
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // This function will be called when the form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear any previous errors

    try {
      const registerRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const result = await signIn("credentials", {
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
          <CardTitle>Register a new account</CardTitle>
          <CardDescription>
            Enter your information below to register a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="space-y-1">
              <FieldLabel className="leading-5" htmlFor="name">
                Name*
              </FieldLabel>
              <Input
                type="text"
                id="name"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <FieldLabel className="leading-5" htmlFor="userEmail">
                Email address*
              </FieldLabel>
              <Input
                type="email"
                id="userEmail"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="w-full space-y-1">
              <FieldLabel className="leading-5" htmlFor="password">
                Password*
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  className="pr-9"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setIsPasswordVisible((prevState) => !prevState)
                  }
                  className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                >
                  {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  <span className="sr-only">
                    {isPasswordVisible ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="w-full space-y-1">
              <FieldLabel className="leading-5" htmlFor="confirmPassword">
                Confirm Password*
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  className="pr-9"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setIsConfirmPasswordVisible((prevState) => !prevState)
                  }
                  className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                >
                  {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  <span className="sr-only">
                    {isConfirmPasswordVisible
                      ? "Hide password"
                      : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <Button className="w-full" type="submit">
              Sign Up to Flavor Forge
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
