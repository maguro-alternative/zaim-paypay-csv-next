'use client';
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button
      className="p-2 bg-blue-500 text-white rounded-md"
      onClick={() => signIn()}
    />
  );
}