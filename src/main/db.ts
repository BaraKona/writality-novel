import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "../db/schema";
import path, { join } from "path";
import { homedir } from "os";
import { appDirectoryName } from "@shared/constants";

const dbPath = join(`${homedir()}/${appDirectoryName}`, "writality-data.db");

console.log({ dbPath });

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });

function toDrizzleResult(row: Record<string, any>);
function toDrizzleResult(
  rows: Record<string, any> | Array<Record<string, any>>,
) {
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

export const execute = async (e, sqlstr, params, method) => {
  const result = sqlite.prepare(sqlstr);
  const ret = result[method](...params);
  return toDrizzleResult(ret);
};

export const runMigrate = async () => {
  migrate(db, {
    migrationsFolder: path.join(__dirname, "../../drizzle"),
  });
};

sqlite.pragma("journal_mode = WAL");
