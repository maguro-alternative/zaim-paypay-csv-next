import type { NextAuthOptions } from "next-auth";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    {
      id: "zaim",
      name: "Zaim",
      type: "oauth",
      version: "1.0a",
      requestTokenUrl: `https://api.zaim.net/v2/auth/request`,
      authorization: `https://auth.zaim.net/users/auth`,
      accessTokenUrl: `https://api.zaim.net/v2/auth/access`,
      profileUrl: `https://api.zaim.net/v2/home/user/verify`,
      async profile(profile, credentials) {
        return {
          id: profile.me.id,
          name: profile.me.name,
          image: profile.me.profile_image_url,
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
      return url
    },
    async session({ session, user, token }) {
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default nextAuthOptions;
