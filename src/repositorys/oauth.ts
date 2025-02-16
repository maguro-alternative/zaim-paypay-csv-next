import { promisify } from "util";

import oauth from "oauth";

export const ZaimOAuth = new oauth.OAuth(
  "https://api.zaim.net/v2/auth/request",
  "https://api.zaim.net/v2/auth/access",
  process.env.ZAIM_CLIENT_ID as string,
  process.env.ZAIM_CLIENT_SECRET as string,
  "1.0",
  null,
  "HMAC-SHA1"
);

export const ZaimGetAsync = promisify(ZaimOAuth.get).bind(ZaimOAuth);
