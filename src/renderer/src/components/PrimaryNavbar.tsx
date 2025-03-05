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
    <nav className={`flex w-full grow items-center gap-1 overflow-x-auto py-1`}>
      <Separator
        orientation="vertical"
        className={`mx-1 h-4 ${sidebarState ? 'hidden' : 'ml-16'}`}
      />
      <Button
        variant="ghost"
        size="icon"
        className="group shrink-0 hover:bg-background"
        onClick={() => setSidebarState(!sidebarState)}
      >
        <Menu size={16} strokeWidth={1.5} className={`block text-text group-hover:hidden`} />
        {sidebarState ? (
          <ChevronsLeft
            size={16}
            strokeWidth={1.5}
            className="hidden text-text group-hover:block"
            onClick={() => setSidebarState((prev) => !prev)}
          />
        ) : (
          <ChevronsRight
            size={16}
            strokeWidth={1.5}
            className="hidden text-text group-hover:block"
            onClick={() => setSidebarState((prev) => !prev)}
          />
        )}
      </Button>
      <Separator orientation="vertical" className={`mx-1 h-4`} />
      <ul className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab, index) => (
          <TabListItem
            key={index}
            tab={tab}
            removeTab={closeAndMoveToNextTab}
            changeTab={() => changeTab(tab.id)}
          />
        ))}
      </ul>

      {tabs.length > 0 && <Separator orientation="vertical" className="mx-1 h-4" />}

      <Button variant="ghost" size="icon" onClick={createTab} className="shrink-0 p-1">
        <Plus color="gray" size={16} />
      </Button>
    </nav>
  )
}
