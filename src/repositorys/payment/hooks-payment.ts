import { ZaimOAuth } from "../oauth";
import type { Session } from "next-auth";
import { Payment, PaymentResponse } from "./types";

export async function registerPaymentsData(
  session: Session | null,
  body: Payment
): Promise<PaymentResponse> {
  try {
    const requestBody = JSON.stringify(body);
    const requestJson = JSON.parse(requestBody);

    const paymentAsync: Promise<PaymentResponse> = new Promise((resolve, reject) => {
      ZaimOAuth.post(
        "https://api.zaim.net/v2/home/money/payment",
        session?.user?.accessToken as string,
        session?.user?.accessTokenSecret as string,
        requestJson,
        "application/json",
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            // ToDO: Fix the type of parsedData
            const parsedData = JSON.parse(data) as PaymentResponse;
            resolve(parsedData);
          }
        }
      );
    });

    return paymentAsync;
  } catch (error) {
    // ToDo: Fix the type of error
    console.error("Failed to register payment data:", error);
    throw error;
  }
};
