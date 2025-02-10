import { useQuery } from '@tanstack/react-query'

export const useFolderById = (id: number) => {
  return useQuery({
    queryKey: ['folder', 'single', id],
    queryFn: () => window.api.getFolderById(id)
  })
}
