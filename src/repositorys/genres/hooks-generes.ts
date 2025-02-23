import { ZaimOAuth } from "../oauth";
import type { Session } from "next-auth";

import { GenreResponse } from "./types";

export async function getGenresData(session: Session | null) {
  const genreAsync: Promise<GenreResponse> = new Promise((resolve, reject) => {
    ZaimOAuth.get(
      "https://api.zaim.net/v2/home/genre",
      session?.user?.accessToken as string,
      session?.user?.accessTokenSecret as string,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          // 文字列として返ってくるデータをJSONとしてパースし、型を適用
          const parsedData = JSON.parse(data) as GenreResponse;
          resolve(parsedData);
        }
      }
    );
  });

  return genreAsync;
};
