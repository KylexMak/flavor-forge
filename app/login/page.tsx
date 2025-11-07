import { FormEvent } from "react";
import LoginButton from "./LoginButton";
import React, { useRef } from "react";

// TODO: SSO

export default function LoginPage() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <LoginButton />
    </form>
  );
}
