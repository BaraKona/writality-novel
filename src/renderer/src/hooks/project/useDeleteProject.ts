import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => window.api.deleteProject(id),
    mutationKey: ['delete-project'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['projects']
      })
    }
  })
}
