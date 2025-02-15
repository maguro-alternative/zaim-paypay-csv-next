import { ZaimOAuth } from "../oauth";
import type { Session } from "next-auth";

import { CategoryResponse } from "./types";

export async function fetchCategorysData(session: Session | null) {
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
  return res.json() as Promise<CategoryResponse>;
};
