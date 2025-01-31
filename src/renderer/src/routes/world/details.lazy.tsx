import { createLazyFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from "react";

export const Route = createLazyFileRoute('/world/details')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className='w-full  grow'>
      <div className='max-w-(--breakpoint-md) mx-auto'>
        safsa
      </div>
    </div>
  )
}
