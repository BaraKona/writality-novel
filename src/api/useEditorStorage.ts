
import { saveContent, getContent } from '../db/database';

export function useEditorStorage() {
  async function handleSave(content: string) {
    const result = saveContent(content);
    return result.lastInsertRowid;
  }

  async function handleLoad(id: number) {
    const row = getContent(id);
    return row ? row.content : null;
  }

  return { handleSave, handleLoad };
}