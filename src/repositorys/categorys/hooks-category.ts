import { ZaimOAuth } from "../oauth";
import type { Session } from "next-auth";

import { CategoryResponse } from "./types";

export async function getCategorysData(session: Session | null) {
  const categoryAsync: Promise<CategoryResponse> = new Promise((resolve, reject) => {
    ZaimOAuth.get(
      "https://api.zaim.net/v2/home/category",
      session?.user?.accessToken as string,
      session?.user?.accessTokenSecret as string,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          // 文字列として返ってくるデータをJSONとしてパースし、型を適用
          const parsedData = JSON.parse(data) as CategoryResponse;
          resolve(parsedData);
        }
      }
    );
  });

  return categoryAsync;
};
