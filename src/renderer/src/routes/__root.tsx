import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
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

export const Route = createRootRoute({
  component: () => (
    <>
      <SidebarProvider>
        <PrimarySidebar />
        <SidebarInset>
          <header className="flex py-0.5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              <PrimaryNavbar />
            </div>
          </header>
          <div className="flex flex-col grow w-full h-full overflow-y-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <TanStackRouterDevtools position='bottom-right'/>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
})