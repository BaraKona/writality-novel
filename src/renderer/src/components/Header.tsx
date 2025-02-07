import { Separator } from '@radix-ui/react-separator'
import { PrimaryNavbar } from './PrimaryNavbar'
import { FC } from 'react'

export const Header: FC = () => {
  return (
    <nav className="flex items-center gap-2  w-full bg-background overflow-x-auto">
      <div className="flex items-center gap-2 grow w-full overflow-x-auto">
        <Separator orientation="vertical" className="h-4 shrink-0" />
        <PrimaryNavbar />
      </div>
    </nav>
  )
}
