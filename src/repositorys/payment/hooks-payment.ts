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
        (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            const parsedData = JSON.parse(data) as PaymentResponse;
            resolve(parsedData);
          }
        }
      );
    });

    return paymentAsync;
  } catch (error) {
    console.error("Failed to register payment data:", error);
    throw error;
  }
};
