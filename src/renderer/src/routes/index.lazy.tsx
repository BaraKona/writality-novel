import { useCurrentDir } from '@renderer/hooks/useProjectDir'
import { createLazyFileRoute, Navigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { data } = useCurrentDir()
  
  useEffect(() => {
    console.log(data)
  }, [data])
  
  return (
     <Navigate to={`/world`} />
  )
}