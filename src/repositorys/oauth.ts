import OAuth from "oauth-1.0a";
import crypto from "crypto";

export const ZaimOAuth = new OAuth({
  consumer: {
    key: process.env.ZAIM_CLIENT_ID as string,
    secret: process.env.ZAIM_CLIENT_SECRET as string,
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});
