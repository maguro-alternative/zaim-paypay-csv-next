import { getServerSession } from "next-auth/next";

import SignIn from "./components/signin";
import SignOut from "./components/signout";
import CSVUploaderForm from "./components/CSVUploaderForm";
import { getAccountsData } from "@/repositorys/accounts/hooks-accounts";
import { getVerifyData } from "@/repositorys/verify/hooks-verify";
import nextAuthOptions from "../app/api/auth/[...nextauth]";
import { signOut } from "next-auth/react";

// 🌟 Static Metadata
export const metadata = {
  title: "Zaim PayPay連携",
  description: "ZaimとPayPayを連携して、支出データを自動で取得します。",
  openGraph: {
    title: "Zaim PayPay連携",
    description: "ZaimとPayPayを連携して、支出データを自動で取得します。",
    images: [{
      url: "/ogp/uchuemon.png", // 🌟 静的画像の指定
      width: 1200,
      height: 630
    }],
  },
};

export default async function Home() {
  const session = await getServerSession(nextAuthOptions);
  if (session) {
    try {
      await getVerifyData(session);
    } catch {
      return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-teal-200">
          <h1 className="text-4xl font-bold">Zaim PayPay連携</h1>
          <p className="text-lg text-center">
            Zaim APIでPayPayを連携して、支出データを自動で取得します。
          </p>
          <p className="text-lg text-center text-red-500">
            連携に失敗しました。再度ログインしてください。
          </p>
          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={() => signOut()}
          >
            ログアウト
          </button>
        </div>
      );
    }
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-teal-200">
      <h1 className="text-4xl font-bold">Zaim PayPay連携</h1>
      <p className="text-lg text-center">
        Zaim APIでPayPayを連携して、支出データを自動で取得します。
      </p>
      {session ? (
        <>
          <SignOut session={session} />
          <CSVUploaderForm accounts={await getAccountsData(session)}/>
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
