import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Chapter } from '@shared/models'

export const useChapter = (id: number): UseQueryResult<Chapter, Error> => {
  return useQuery({
    queryKey: ['chapter', id],
    queryFn: () => window.api.getChapterById(id)
  })
}
