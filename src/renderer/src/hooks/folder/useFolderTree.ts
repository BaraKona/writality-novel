import { useQuery } from '@tanstack/react-query'

export const useFolderTree = (id: number) => {
  return useQuery({
    queryKey: ['folder', 'tree', id],
    queryFn: () => window.api.getFolderTree(id)
  })
}
