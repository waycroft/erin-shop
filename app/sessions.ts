import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      maxAge: 864000,
      secrets: [process.env.COOKIE_SECRET ?? "AfA95Kohw89EjyqyErs5dqVowqvvi6T"]
    },
  });

export { getSession, commitSession, destroySession };