import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "../db/schema";
import path, { join } from "path";
import { homedir } from "os";
import { appDirectoryName } from "@shared/constants";

const dbPath = join(`${homedir()}/${appDirectoryName}`, "writality-data-0.db");

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });

type DrizzleRow = Record<string, unknown>;
type DrizzleResult = unknown[];

function toDrizzleResult(rows: DrizzleRow | Array<DrizzleRow>): DrizzleResult {
  if (!rows) {
    return [];
  }
  if (Array.isArray(rows)) {
    return rows.map((row) => {
      return Object.keys(row).map((key) => row[key]);
    });
  } else {
    return Object.keys(rows).map((key) => rows[key]);
  }
}

type SqliteMethod = "all" | "get" | "run";

export const execute = async (
  _event: unknown,
  sqlstr: string,
  params: unknown[],
  method: SqliteMethod,
): Promise<DrizzleResult> => {
  const result = sqlite.prepare(sqlstr);
  const ret = result[method](...params);
  return toDrizzleResult(ret as DrizzleRow | Array<DrizzleRow>);
};

export const runMigrate = async (): Promise<void> => {
  migrate(db, {
    migrationsFolder: path.join(__dirname, "../../drizzle"),
  });
};

sqlite.pragma("journal_mode = WAL");
