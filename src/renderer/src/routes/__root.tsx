import { createRootRoute, Outlet, ReactNode } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PrimarySidebar } from "@renderer/components/sidebar/PrimarySidebar"
import { Separator } from "@renderer/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@renderer/components/ui/sidebar"
import { PrimaryNavbar } from '@renderer/components/PrimaryNavbar'
import { useCurrentDir } from '@renderer/hooks/useProjectDir'
import { Store } from "@tanstack/store";
import { useEffect } from 'react'
import { ProjectDirectory } from '@shared/models'
import { Header } from '@renderer/components/Header'
export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Writality',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}


function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { data } = useCurrentDir()

  return (
    <>
      <SidebarProvider className=''>
        <PrimarySidebar projectDir={data}/>
        <SidebarInset>
        <Header />
          <section className="flex flex-col grow w-full h-full !z-0 relative" data-registry="plate">
            {children}
          </section>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools position='bottom-right'/>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

