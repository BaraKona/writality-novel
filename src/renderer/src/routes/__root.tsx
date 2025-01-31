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
        title: 'TanStack Start Starter',
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
  const { data, isLoading } = useCurrentDir()

  if (isLoading) {
    return <div>Loading...</div>
  }
  
  return (
    <div className='border-t overflow-y-auto'>
      <SidebarProvider>
        <PrimarySidebar projectDir={data}/>
        <SidebarInset className='overflow-y-auto'>
          <header className="flex  shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full">
            <div className="flex items-center gap-2 px-2">
              <SidebarTrigger className="" />
              <Separator orientation="vertical" className="h-4" />
              <PrimaryNavbar />
            </div>
          </header>
          <section className="flex flex-col grow w-full h-full overflow-y-auto">
            {children}
          </section>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools position='bottom-right'/>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  )
}

