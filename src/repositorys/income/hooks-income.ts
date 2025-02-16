import { ZaimOAuth } from "../oauth";
import type { Session } from "next-auth";
import { Income, IncomeResponse } from "./types";

export async function registerIncomesData(
  session: Session | null,
  body: Income
): Promise<IncomeResponse> {
  try {
    const requestBody = JSON.stringify(body);
    const requestJson = JSON.parse(requestBody);

    const incomeAsync: Promise<IncomeResponse> = new Promise((resolve, reject) => {
      ZaimOAuth.post(
        "https://api.zaim.net/v2/home/money/income",
        session?.user?.accessToken as string,
        session?.user?.accessTokenSecret as string,
        requestJson,
        "application/json",
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            const parsedData = JSON.parse(data) as IncomeResponse;
            resolve(parsedData);
          }
        }
      );
    });

    return incomeAsync;
  } catch (error) {
    console.error("Failed to register income data:", error);
    throw error;
  }
};
