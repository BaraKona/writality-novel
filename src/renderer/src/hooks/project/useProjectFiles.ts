import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Project } from '@shared/models'

export const useProjectFiles = (id: number): UseQueryResult<Project, Error> => {
  return useQuery({
    queryKey: ['projects', 'files', id],
    queryFn: () => window.api.getProjectFiles(id)
  })
}
