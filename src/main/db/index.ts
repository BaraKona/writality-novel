
import Database, { Database as DatabaseType } from 'better-sqlite3'
import { join } from 'path'
import { getRootDir } from '../api'

export const database: DatabaseType = new Database(join(getRootDir(), 'appdata.db'))

database.pragma('journal_mode = WAL')