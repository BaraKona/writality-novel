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
import GitlabSidebarPage from '@renderer/components/sidebar/Sidebar'
import { Sidebar } from '@renderer/components/sidebar/Sidebar'
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

export const Open = {
  Open: 'open',
  Closed: 'closed'
} as const

type Open = (typeof Open)[keyof typeof Open]

export const sidebarStateAtom = atomWithStorage<Open>('sidebarState', Open.Open)
export const projectDirAtom = atomWithStorage<ProjectDirectory | null>('projectDir', null)

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { data: projectDir } = useCurrentDir()

  const [projectDirState, setProjectDirState] = useAtom(projectDirAtom)

  useEffect(() => {
    if (projectDir) {
      setProjectDirState(projectDir)
    }
  }, [projectDir])

  return (
    <Sidebar>
      <Header />
      <div className="flex h-full grow flex-col overflow-y-auto">{children}</div>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </Sidebar>
  )
}
