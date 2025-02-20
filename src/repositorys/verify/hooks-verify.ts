import { ZaimOAuth } from "../oauth";
import type { Session } from "next-auth";
import { VerifyResponse } from "./types";

export async function getVerifyData(session: Session | null): Promise<VerifyResponse> {
  try {
    const verifyAsync: Promise<VerifyResponse> = new Promise((resolve, reject) => {
      ZaimOAuth.get(
        "https://api.zaim.net/v2/home/user/verify",
        session?.user?.accessToken as string,
        session?.user?.accessTokenSecret as string,
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (err: any, data: any) => {
          if (err) {
            console.error("Failed to get verify data:", err);
            reject(err);
          } else {
            const parsedData = JSON.parse(data) as VerifyResponse;
            resolve(parsedData);
          }
        }
      );
    });
    return verifyAsync;
  } catch (error) {
    console.error("Failed to get verify data:", error);
    throw error;
  }
};
