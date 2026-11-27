import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

// Resolve from this file so configuration also works when run from the repo root.
dotenv.config({
  path: fileURLToPath(new URL('../../.env', import.meta.url)),
  quiet: true,
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONGODB_URI: z.string().trim().regex(/^mongodb(?:\+srv)?:\/\/\S+$/),
  CLIENT_ORIGIN: z.string().trim().url().refine((value) => {
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol)
        && !url.username && !url.password
        && url.pathname === '/' && !url.search && !url.hash;
    } catch {
      return false;
    }
  }).transform((value) => new URL(value).origin),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const fields = [...new Set(result.error.issues.map((issue) => issue.path[0]))];
  // Only name invalid settings; configuration values can contain credentials.
  throw new Error(`Invalid environment configuration: ${fields.join(', ')}`);
}

export const env = result.data;
