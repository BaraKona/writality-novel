import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateChapter = (parent_id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createChapter'],
    mutationFn: (type: string) => window.api.createChapter(type, parent_id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['chapters', parent_id]
      })
  })
}
