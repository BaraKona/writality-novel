import Database, { Database as DatabaseType } from 'better-sqlite3'
import { join } from 'path'
import { appDirectoryName } from '@shared/constants'
import { homedir } from 'os'

export const database: DatabaseType = new Database(
  join(`${homedir()}/${appDirectoryName}`, 'appdata.db')
)

// Utility function to handle JSON serialization/deserialization
export function serialize(data: any): string {
  return JSON.stringify(data)
}

export function deserialize(data: string): any {
  return data ? JSON.parse(data) : null
}

database.pragma('journal_mode = WAL')
