import SignIn from "./components/signin";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Next.js + NextAuth.js</h1>
      <p className="text-lg text-center">
        Example integration of Next.js with NextAuth.js
      </p>
      <div className="flex flex-col gap-4"> 
        <SignIn />
      </div>
    </div>
  );
}
