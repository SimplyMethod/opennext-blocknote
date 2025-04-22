import { drizzle } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as schema from '@/drizzle/schema';

let db: ReturnType<typeof drizzle<typeof schema>>;

export async function getDb() {
  if (!db) {
    const { env } = await getCloudflareContext({ async: true });

    db = drizzle(env.DB, { schema });
  }

  return db;
}
