import { Tab } from '@shared/models'
import { useMemo } from 'react'
import { Store } from "@tanstack/store";
import { useStore } from '@tanstack/react-store';

export const useLocalTabStorage = () => {
  const key = `tabs`
  const storedTabs = localStorage.getItem(key)
  
  const initialTabs: Tab[] = useMemo(() => {
    if (storedTabs) {
      return JSON.parse(storedTabs)
    }
    return [
      {
        id: 1,
        name: 'Library',
        url: '/',
        active: true,
        position: 0
      }
    ]
  }, [storedTabs, key])

  const tabStore = new Store({
    tabs: initialTabs
  })
  
  const tabs = useStore(tabStore, (state) => state.tabs);
  const updateTabs = (newTabs: Tab[]) => {
    tabStore.setState(() => {
      return { tabs: newTabs }
    })
    localStorage.setItem(key, JSON.stringify(newTabs))
  }

  return [tabs, updateTabs] as const
}
