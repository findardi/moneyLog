import { z, ZodError } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("DEVELOPMENT"),
  PORT: z.coerce.number().default(8777),
  APP_ORIGIN: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_TIMEOUT: z.coerce.number().default(10000),
  DB_SSL: z.string().default("false"),

  JWT_SECRET: z.string().default("most-secret-jwt"),

  DEFAULT_USERNAME: z.string(),
  DEFAULT_PASSWORD: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
let env: Env;

try {
  env = EnvSchema.parse(Bun.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.error("❌ Invalid environment variables:");
    for (const issue of error.issues) {
      console.error(`- ${issue.path.join(".")}: ${issue.message}`);
    }
  } else {
    console.error(error);
  }
  process.exit(1);
}

export default env;
