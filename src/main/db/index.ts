
import Database, { Database as DatabaseType } from 'better-sqlite3'
import { join } from 'path'

export const database: DatabaseType = new Database(join(__dirname, 'appdata.db'))
database.pragma('journal_mode = WAL')