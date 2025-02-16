import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string | number;
    name: string;
    image: string;
    accessToken?: string;
    accessTokenSecret?: string;
  }
  interface AdapterUser {
    id: string | number;
    name: string;
    image: string;
    accessToken?: string;
    accessTokenSecret?: string;
  }

  interface Session {
    user: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    name?: string | null
    email?: string | null
    picture?: string | null
    sub?: string
    accessToken: string | undefined;
    accessTokenSecret: string | undefined;
  }
}

const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.JWT_SECRET
  },
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
      async profile(profile) {
        return {
          id: profile.me.id,
          name: profile.me.name,
          image: profile.me.profile_image_url,
        };
      },
      token: {
        url: `https://api.zaim.net/v2/auth/access`,
      },
      clientId: process.env.ZAIM_CLIENT_ID,
      clientSecret: process.env.ZAIM_CLIENT_SECRET,
    },
  ],
  callbacks: {
    async signIn({ user, account }) {
      user.accessToken = account?.access_token;
      user.accessTokenSecret = account?.access_token_secret as string | undefined;
      return true
    },
    async redirect({ url }) {
      return url
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.oauth_token as string | undefined;
        token.accessTokenSecret = account.oauth_token_secret as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken,
          accessTokenSecret: token.accessTokenSecret,
        },
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default nextAuthOptions;
