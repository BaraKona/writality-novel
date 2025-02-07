import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateFolder = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['createProject'],
    mutationFn: () => window.api.createFolder(projectId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['projectFolders', projectId]
      })
  })
}
