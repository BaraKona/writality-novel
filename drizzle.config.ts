import "dotenv/config";
import { defineConfig, Config } from "drizzle-kit";
import { join } from "path";
import { homedir } from "os";
import { appDirectoryName } from "./src/shared/constants";
import { existsSync, mkdirSync } from "fs";

// Ensure the application directory exists
const appDir = join(homedir(), appDirectoryName);
if (!existsSync(appDir)) {
  mkdirSync(appDir, { recursive: true });
}

console.log({ appDir });
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "/Users/barakona/writality-novel-dev/writality-data.db",
  },
}) satisfies Config;
