import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query'
import { Folder, Project } from '@shared/models'

export const useUpdateFolder = (): UseMutationResult<Folder, Error, Folder, unknown> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (folder: Folder) => window.api.updateFolder(folder),
    mutationKey: ['updateFolder'],
    onSuccess: (data: Folder) => {
      // Update the specific folder's data
      queryClient.setQueryData(['folder', data.id], (prevData: Project) => {
        return { ...prevData, name: data.name, emoji: data.emoji }
      })

      // Update the nested folders within the project
      queryClient.setQueryData(['project', 'folders', data.project_id], (prevData: Folder[]) => {
        const updateNestedFolders = (folders: Folder[]): Folder[] => {
          return folders.map((folder) => {
            if (folder.id === data.id) {
              // If the folder matches the updated folder, return the new data
              return data
            }
            if (folder.children && folder.children.length > 0) {
              // If the folder has children, recursively update them
              return { ...folder, children: updateNestedFolders(folder.children) }
            }
            // If the folder doesn't match and has no children, return it unchanged
            return folder
          })
        }

        // Return the updated folders array
        return updateNestedFolders(prevData)
      })
    }
  })
}
