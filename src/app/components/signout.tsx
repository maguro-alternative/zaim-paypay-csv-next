'use client';
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import Image from 'next/image';

interface SignOutProps {
  session: Session;
}

export default function SignOut({ session }: SignOutProps) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10">
      <p className="text-gray-700">Signed in as {session?.user?.name}</p>
      {session?.user?.image && (
        <div className="relative w-10 h-10">
          <Image 
            src={session.user.image} 
            alt={session?.user?.name ?? "プロフィール画像"} 
            fill
            className="rounded-full object-cover"
            sizes="40px"
            priority
          />
        </div>
      )}
      <button
        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
