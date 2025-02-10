import { useQuery } from '@tanstack/react-query'

export const useProjectFolders = (projectId: number) => {
  return useQuery({
    queryKey: ['project', 'folders', projectId],
    queryFn: () => window.api.getProjectFolders(projectId)
  })
}
