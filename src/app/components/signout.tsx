'use client';
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface SignOutProps {
  session: Session;
}

export default function SignOut({ session }: SignOutProps) {
  return (
    <div>
      <p>Signed in as {session?.user?.name}</p>
      <img src={session?.user?.image} alt={session?.user?.name} />
      <button
        className="p-2 bg-red-500 text-white rounded-md"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
