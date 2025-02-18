import { ZaimOAuth } from "../oauth";
import type { Session } from "next-auth";

import { accountResponse } from "./types";

export async function getAccountsData(session: Session | null) {
  const accountAsync: Promise<accountResponse> = new Promise((resolve, reject) => {
    ZaimOAuth.get(
      "https://api.zaim.net/v2/home/account",
      session?.user?.accessToken as string,
      session?.user?.accessTokenSecret as string,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          // 文字列として返ってくるデータをJSONとしてパースし、型を適用
          const parsedData = JSON.parse(data) as accountResponse;
          resolve(parsedData);
        }
      }
    );
  });

  return accountAsync;
};
