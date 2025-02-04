import { Separator } from "@radix-ui/react-separator"
import { PrimaryNavbar } from "./PrimaryNavbar"
import { FC } from "react"

export const Header: FC = () => {

  return(
          <nav className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 w-full z-10 top-0 bg-background h-8"
          >
            <div className="flex items-center gap-2 grow w-full overflow-x-auto">
              <Separator orientation="vertical" className="h-4 shrink-0" />
              <PrimaryNavbar />
            </div>
          </nav>
  )
}