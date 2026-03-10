import { createClient } from "@libsql/client/web";

const tursoUrl = import.meta.env.VITE_TURSO_URL;
const tursoAuthToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

export const tursoClient = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});
