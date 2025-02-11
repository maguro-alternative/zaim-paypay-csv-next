import NextAuth from "next-auth";

import nextAuthOptions from "../[...nextauth]";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
