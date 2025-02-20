import { ZaimOAuth } from "../oauth";
import type { Session } from "next-auth";

import { MoneyParams, MoneyResponse } from "./types";

import { stringify } from 'querystring';

export async function getMoneysData(
  session: Session | null,
  params?: MoneyParams
): Promise<MoneyResponse>  {
  let url = "https://api.zaim.net/v2/home/money";

  if (params) {
    const queryString = stringify(params);
    url += `?${queryString}`;
  }
  const moneyAsync: Promise<MoneyResponse> = new Promise((resolve, reject) => {
    ZaimOAuth.get(
      url,
      session?.user?.accessToken as string,
      session?.user?.accessTokenSecret as string,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          const parsedData = JSON.parse(data) as MoneyResponse;
          resolve(parsedData);
        }
      }
    );
  });

  return moneyAsync;
};
