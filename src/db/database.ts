
import Database from 'better-sqlite3';

const db = new Database('appdata.db');

// Create table for editor content if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS editor_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
  )
`);

export function saveContent(content: string) {
  const stmt = db.prepare('INSERT INTO editor_content (content) VALUES (?)');
  return stmt.run(content);
}

export function getContent(id: number) {
  const stmt = db.prepare('SELECT content FROM editor_content WHERE id = ?');
  return stmt.get(id);
}