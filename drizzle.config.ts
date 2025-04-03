import { defineConfig, Config } from "drizzle-kit";
import { homedir } from "os";
import { join } from "path";
import { appDirectoryName } from "./src/shared/constants";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: join(`${homedir()}/${appDirectoryName}`, "writality-data-0.db"),
  },
}) satisfies Config;
