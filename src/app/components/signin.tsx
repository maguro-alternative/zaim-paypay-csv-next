'use client';
import { signIn, signOut, useSession, SessionProvider } from "next-auth/react";

export default function SignIn() {
  return (
    <SessionProvider>
      <SignInContent />
    </SessionProvider>
  );
}

function SignInContent() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Signed in as {session?.user?.name}</p>
        <button
          className="p-2 bg-red-500 text-white rounded-md"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      className="p-2 bg-blue-500 text-white rounded-md"
      onClick={() => signIn("zaim", { callbackUrl: "http://localhost:3000" })}
    >
      Sign in with Zaim
    </button>
  );
}