import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query'
import { Chapter } from '@shared/models'

export const useUpdateChapter = (): UseMutationResult<Chapter, Error, Chapter, unknown> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (chapter: Chapter) => window.api.updateChapter(chapter),
    mutationKey: ['updateProject'],
    onSuccess: (data: Chapter) => {
      console.log('Project updated:', data)
      queryClient.setQueryData(['chapters', data.id], (prevData: Chapter) => {
        return { ...prevData, name: data.name }
      })
    }
  })
}
