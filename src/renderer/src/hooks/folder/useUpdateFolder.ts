import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query'
import { Folder, Project } from '@shared/models'

export const useUpdateFolder = (): UseMutationResult<Folder, Error, Folder, unknown> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folder: Folder) => window.api.updateFolder(folder),
    mutationKey: ['updateFolder'],
    onSuccess: (data: Folder) => {
      queryClient.setQueryData(['folder', data.id], (prevData: Project) => {
        return { ...prevData, name: data.name, emoji: data.emoji }
      })
      queryClient.setQueryData(['projectFolders', data.project_id], (prevData: Folder[]) => {
        return prevData.map((folder) => (folder.id === data.id ? data : folder))
      })
    }
  })
}
