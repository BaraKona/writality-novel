import Database, { Database as DatabaseType } from 'better-sqlite3'
import { join } from 'path'
import { getRootDir } from '../api'

export const database: DatabaseType = new Database(join(getRootDir(), 'appdata.db'))

// Utility function to handle JSON serialization/deserialization
export function serialize(data: any): string {
  return JSON.stringify(data)
}

export function deserialize(data: string): any {
  return data ? JSON.parse(data) : null
}

database.pragma('journal_mode = WAL')
