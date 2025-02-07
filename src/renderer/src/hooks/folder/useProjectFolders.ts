import { useQuery } from '@tanstack/react-query'

export const useProjectFolders = (projectId: number) => {
  return useQuery({
    queryKey: ['projectFolders', projectId],
    queryFn: () => window.api.getProjectFolders(projectId)
  })
}
