import { defineConfig, Config } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  // dbCredentials: {
  //   url: join(`${homedir()}/${appDirectoryName}`, "writality-data-0.db"),
  // },
}) satisfies Config;
