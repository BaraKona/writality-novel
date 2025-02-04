import { ProjectDirectory } from '@shared/models'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

export const useCurrentDir: () => UseQueryResult<ProjectDirectory, Error> = () => {
  return useQuery({
    queryKey: ['currentProjectDir'],
    queryFn: () => window.api.getCurrentProjectId()
  })
}
