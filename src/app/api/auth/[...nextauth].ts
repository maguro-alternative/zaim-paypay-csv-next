/*
// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import type { OAuthConfig } from 'next-auth/providers/oauth';
import { OAuth } from 'oauth';

// OAuth 1.0aクライアントの作成
const oauthClient = new OAuth(
  'https://api.zaim.net/v2/auth/request',
  'https://api.zaim.net/v2/auth/access',
  process.env.CLIENT_ID!,
  process.env.CLIENT_SECRET!,
  '1.0a',
  process.env.NEXTAUTH_URL + '/api/auth/callback/zaim',
  'HMAC-SHA1'
);

// カスタムプロバイダーの型定義
interface CustomProfile {
  id: string;
  name: string;
  email: string;
}

// OAuth 1.0aプロバイダーの実装
const CustomProvider: OAuthConfig<CustomProfile> = {
  id: 'custom',
  name: 'Custom OAuth 1.0a',
  type: 'oauth',
  version: '1.0a',
  
  // OAuth 1.0aの認証URLを生成
  authorization: {
    url: 'https://auth.zaim.net/users/auth'
  },
  
  // リクエストトークンの取得
  requestTokenUrl: 'https://api.zaim.net/v2/auth/request',
  
  // アクセストークンの取得
  accessTokenUrl: 'https://api.zaim.net/v2/auth/access',
  
  // プロフィール情報の取得
  async profile(profile, tokens) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: null
    };
  },
  clientId: process.env.ZAIM_CLIENT_ID,
  clientSecret: process.env.ZAIM_CLIENT_SECRET,
};

// NextAuth設定
export const authOptions: NextAuthOptions = {
  providers: [CustomProvider],
  
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.oauth_token;
        token.accessTokenSecret = account.oauth_token_secret;
      }
      return token;
    },
    
    async session({ session, token }) {
      return session;
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;

// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    accessTokenSecret?: string;
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
  
  interface JWT {
    accessToken?: string;
    accessTokenSecret?: string;
  }
}
*/
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
          image: null,
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
