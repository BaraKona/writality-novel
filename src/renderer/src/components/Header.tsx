import { Separator } from "@radix-ui/react-separator"
import { SIDEBAR_WIDTH, SidebarTrigger } from "./ui/sidebar"
import { PrimaryNavbar } from "./PrimaryNavbar"
import { useSidebar } from "./ui/sidebar"

export const Header = () => {
  const { open } = useSidebar()

  return(
          <nav className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full z-10 fixed top-0 bg-background h-8"
            style={{ width: open ? `calc(100% - ${SIDEBAR_WIDTH}rem) right-0` : "" }}
          >
            <div className="flex items-center gap-2 px-2 grow w-full overflow-x-auto">
              <SidebarTrigger className="" />
              <Separator orientation="vertical" className="h-4 shrink-0" />
              <PrimaryNavbar />
            </div>
          </nav>
  )
}