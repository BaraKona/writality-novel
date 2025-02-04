import { ChevronsLeft, ChevronsRight, Menu, Plus } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@renderer/components/ui/button'
import { useTabs } from '@renderer/hooks/useTabs'
import { TabListItem } from './tabs/TabListItem'
import { Separator } from '@renderer/components/ui/separator'
import { sidebarStateAtom } from '@renderer/routes/__root'
import { useAtom } from 'jotai'

export const PrimaryNavbar: FC = () => {
  const { createTab, closeAndMoveToNextTab, changeTab, tabs } = useTabs()
  // const { tabRouteChange } = useTabs()

  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom)

  // useEffect(() => {
  //   tabRouteChange()
  // }, [location.pathname])

  return (
    <nav className={`flex items-center py-1 gap-1 w-full grow`}>
      <Separator
        orientation="vertical"
        className={`h-4 mx-1 ${sidebarState ? 'hidden' : 'ml-16'}`}
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 hover:bg-background group"
        onClick={() => setSidebarState(!sidebarState)}
      >
        <Menu size={16} strokeWidth={1.5} className={`group-hover:hidden block text-text`} />
        {sidebarState ? (
          <ChevronsLeft
            size={16}
            strokeWidth={1.5}
            className="group-hover:block hidden text-text"
            onClick={() => setSidebarState((prev) => !prev)}
          />
        ) : (
          <ChevronsRight
            size={16}
            strokeWidth={1.5}
            className="group-hover:block hidden text-text"
            onClick={() => setSidebarState((prev) => !prev)}
          />
        )}
      </Button>
      <Separator orientation="vertical" className={`h-4 mx-1`} />
      <ul className="flex gap-1 items-center">
        {tabs.map((tab, index) => (
          <TabListItem
            key={index}
            tab={tab}
            removeTab={closeAndMoveToNextTab}
            changeTab={() => changeTab(tab.id)}
          />
        ))}
      </ul>

      {tabs.length > 0 && <Separator orientation="vertical" className="h-4 mx-1" />}

      <Button variant="ghost" size="icon" onClick={createTab} className="shrink-0 p-1">
        <Plus color="gray" size={16} />
      </Button>
    </nav>
  )
}
