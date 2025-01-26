import { Plus } from 'lucide-react'
import { FC, useEffect } from 'react'
import { Button } from '@renderer/components/ui/button'
import { useTabs } from '@renderer/hooks/useTabs'
import { TabListItem } from './tabs/TabListItem'
import { Separator } from "@renderer/components/ui/separator"



export const PrimaryNavbar: FC = () => {
  const { createTab, closeAndMoveToNextTab, changeTab, tabs } = useTabs()
  const { tabRouteChange } = useTabs()
  
  useEffect(() => {
    tabRouteChange()
  }, [location.pathname])

  return (
    <div className={`w-full flex items-center py-1 gap-1`}>
      <ul className="flex gap-1 items-center overflow-x-auto">
        {tabs.map((tab, index) => (
          <TabListItem
            key={index}
            tab={tab}
                  removeTab={closeAndMoveToNextTab}
            changeTab={() => changeTab(tab.id)}
          />
        ))}
      </ul>
      {tabs.length > 0 &&
        <Separator orientation="vertical" className="h-4 mx-1" />
      }

      <Button variant="ghost" size="icon" onClick={createTab} className="p-1 m-auto">
        <Plus color="gray" size={16} />
      </Button>
    </div>
  )
}