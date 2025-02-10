import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateFolder = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createProject'],
    mutationFn: (parent_id: number | null) => window.api.createFolder(projectId, parent_id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['projectFolders', projectId]
      })
  })
}
