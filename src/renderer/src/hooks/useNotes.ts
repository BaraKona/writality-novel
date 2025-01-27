
import { useQuery } from '@tanstack/react-query';
import { useNoteStorage } from '../../../api/notes';

export function useNotes() {
  const { handleGetNotesByProject } = useNoteStorage();
  console.log('useNotes')
  return useQuery({
    queryKey: ['notes'],
    queryFn: () => handleGetNotesByProject(1),
  })
}