import { useCurrentDir } from '@renderer/hooks/useProjectDir'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { data, isLoading } = useCurrentDir()
  
  return (
     <Navigate to={`/world/details`} />
  )
}