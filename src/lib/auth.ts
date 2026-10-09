import { betterAuth } from "better-auth";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
throw new Error("DATABASE_URL is missing from environment variables");
}

export const auth = betterAuth({
database: new Pool({
connectionString: databaseUrl,
ssl: {
rejectUnauthorized: false,
},
}),

secret: process.env.BETTER_AUTH_SECRET,

baseURL:
process.env.BETTER_AUTH_URL ||
"http://localhost:3000",

emailAndPassword: {
enabled: true,
},

socialProviders: {
...(process.env.GOOGLE_CLIENT_ID &&
process.env.GOOGLE_CLIENT_SECRET
? {
google: {
clientId: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
},
}
: {}),


...(process.env.GITHUB_CLIENT_ID &&
process.env.GITHUB_CLIENT_SECRET
  ? {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      },
    }
  : {}),


},

trustedOrigins: [
process.env.BETTER_AUTH_URL || "http://localhost:3000",
],
});
