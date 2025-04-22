import type {Config} from 'drizzle-kit';

export default process.env.DATABASE_URL
  ? {
      schema: './src/drizzle/schema.ts',
      out: './src/drizzle/migrations',
      dialect: 'sqlite',
      dbCredentials: {
        url: process.env.DATABASE_URL,
      },
    }
  : ({
      schema: './src/drizzle/schema.ts',
      out: './src/drizzle/migrations',
      dialect: 'sqlite',
      driver: 'd1-http',
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID!,
        databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
        token: process.env.CLOUDFLARE_D1_API_TOKEN!,
      },
    } satisfies Config);
