import type { NextAuthOptions } from "next-auth";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    {
      id: "zaim",
      name: "Zaim",
      type: "oauth",
      version: "1.0A",
      requestTokenUrl: `https://api.zaim.net/v2/auth/request`,
      authorization: `https://auth.zaim.net/users/auth`,
      accessTokenUrl: `https://api.zaim.net/v2/auth/access`,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
        };
      },
      clientId: process.env.ZAIM_CLIENT_ID,
      clientSecret: process.env.ZAIM_CLIENT_SECRET,
    },
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  },
};

export default nextAuthOptions;
