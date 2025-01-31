import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { defaultDateTimeFormat } from '@renderer/lib/utils'
import { useLocation } from '@tanstack/react-router'
import { getFileNameFromPath } from '@shared/functions'

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
