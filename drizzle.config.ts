import "dotenv/config";
import { defineConfig, Config } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "/Users/barakona/writality-novel-dev/writality-data.db",
  },
}) satisfies Config;
