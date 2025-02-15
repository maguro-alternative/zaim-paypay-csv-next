import { useSuspenseQuery } from "@tanstack/react-query";
import { signIn, signOut, useSession, SessionProvider } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { ZaimOAuth } from "../oauth";

import nextAuthOptions from "../../app/api/auth/[...nextauth]";


export async function fetchData() {
  const session = await getServerSession(nextAuthOptions);
  const authHeader = ZaimOAuth.toHeader(
    ZaimOAuth.authorize(
      {
        url: "https://api.zaim.net/v2/home/category",
        method: "GET",
      },
      {
        key: session?.user?.accessToken as string,
        secret: session?.user?.accessTokenSecret as string,
      }
    )
  );
  const res = await fetch("https://api.zaim.net/v2/home/category", {
    headers: {
      ...authHeader,
    }
  });
  return res.json();
}
