"use client";

import React, { RefObject } from "react";
import { useRouter } from "next/navigation";

type Props = {};

const LoginButton = (props: Props) => {
  const router = useRouter();

  async function handleSubmit() {
    const formData = new FormData(props.formElement.current!);
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/profile");
    } else {
      // Handle errors
    }
  }

  return (
    <button onClick={handleSubmit} type="submit">
      Login
    </button>
  );
};

export default LoginButton;
