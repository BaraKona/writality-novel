import { useQuery } from '@tanstack/react-query'

export const useFolderById = (id: number) => {
  return useQuery({
    queryKey: ['folder', id],
    queryFn: () => window.api.getFolderById(id)
  })
}
