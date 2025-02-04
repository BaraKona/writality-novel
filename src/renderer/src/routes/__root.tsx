import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { createRootRoute, Outlet, ReactNode } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PrimarySidebar } from '@renderer/components/sidebar/PrimarySidebar'
import { Separator } from '@renderer/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@renderer/components/ui/sidebar'
import { PrimaryNavbar } from '@renderer/components/PrimaryNavbar'
import { useCurrentDir } from '@renderer/hooks/useProjectDir'
import { Store } from '@tanstack/store'
import { useEffect } from 'react'
import { ProjectDirectory } from '@shared/models'
import { Header } from '@renderer/components/Header'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/ui/resizable'
export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'Writality'
      }
    ]
  }),
  component: RootComponent
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

export const sidebarStateAtom = atomWithStorage('sidebarState', true)

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { data } = useCurrentDir()
  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={`w-full h-full flex min-h-screen max-h-screen grow`}
    >
      <ResizablePanel
        defaultSize={15}
        className={`min-w-[300px] bg-sidebar relative max-w-[400px] flex flex-col grow group ${sidebarState ? 'show' : 'hide'}`}
      >
        <PrimarySidebar projectDir={data} />
      </ResizablePanel>
      <ResizableHandle onClick={() => setSidebarState((prev) => !prev)} />
      <ResizablePanel defaultSize={75}>
        <Header />
        <section
          className="flex flex-col grow w-full h-full !z-0 relative overflow-y-auto"
          data-registry="plate"
        >
          {children}
        </section>
      </ResizablePanel>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </ResizablePanelGroup>
  )
}
