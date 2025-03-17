import { useEffect, useRef } from "react";
import { Tab } from "@shared/models";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useLocalTabStorage } from "./useLocalTabstorage";

export const useTabs = (): {
  createTab: () => void;
  closeAndMoveToNextTab: (tab: Tab) => void;
  tabRouteChange: () => void;
  changeTab: (tabId: number) => void;
  tabs: Tab[];
} => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useLocalTabStorage();

  const prevDeps = useRef({ location, navigate, tabs, setTabs });

  useEffect(() => {
    const changedDeps = Object.keys(prevDeps.current).filter(
      (key) =>
        prevDeps.current[key] !== { location, navigate, tabs, setTabs }[key],
    );
    if (changedDeps.length > 0) {
      console.info("Dependencies changed:", changedDeps);
    }
    prevDeps.current = { location, navigate, tabs, setTabs };

    tabRouteChange();
  });

  const closeAndMoveToNextTab = (tab: Tab): void => {
    if (!tab.active) {
      const newTabs = tabs.filter((t) => t.id !== tab.id);
      setTabs(newTabs);
      return;
    }

    const isTabActive = tab.active;
    const updatedTabs: Tab[] = tabs.filter((t) => t.id !== tab.id);

    if (isTabActive && updatedTabs.length > 0) {
      const removedTabIndex = tabs.findIndex((t) => t.id === tab.id);
      const previousTabIndex = removedTabIndex > 0 ? removedTabIndex - 1 : 0;
      const newActiveTabId = updatedTabs[previousTabIndex].id;

      const finalTabs = updatedTabs.map((t) => ({
        ...t,
        active: t.id === newActiveTabId,
      }));

      setTabs(finalTabs);
      navigate({ to: finalTabs[previousTabIndex].url || "/new-page" });
    } else {
      setTabs(updatedTabs);
      navigate({ to: "/" });
    }
  };

  const createTab = (): void => {
    const newTab: Tab = {
      id: new Date().getTime(),
      position: tabs.length,
      name: "New Page",
      url: "/new-page",
      active: true,
    };

    const newTabs = tabs.map((tab) => ({ ...tab, active: false }));
    newTabs.push(newTab);
    setTabs(newTabs);

    navigate({ to: newTab.url });
  };

  // Called whenever location changes
  // In useEffect in the App
  const tabRouteChange = (): void => {
    const newTabs = tabs.map((tab) => {
      const activeTab = tabs.find((t) => t.active);
      const url = location.pathname;
      const name = location.pathname === "/" ? "World" : formatTabName(tab);
      const query = location.search.query;

      return {
        ...tab,
        active: tab.id === activeTab?.id,
        name: tab.id === activeTab?.id ? name : tab.name,
        url: tab.id === activeTab?.id ? url : tab.url,
        search: { query: tab.id === activeTab?.id ? query : tab.search?.query },
      };
    });
    setTabs(newTabs);
  };

  const changeTab = (tabId: number): void => {
    const updatedTabs = tabs.map((tab) => ({
      ...tab,
      active: tab.id === tabId,
    }));

    setTabs(updatedTabs);

    navigate({
      to: updatedTabs.find((tab) => tab.id === tabId)?.url || "/",
      search: {
        query: updatedTabs.find((tab) => tab.id === tabId)?.search?.query,
      },
    });
  };

  function formatTabName(tab: Tab): string {
    if (!tab.url) {
      return "New Page";
    }

    if (tab.url.includes("home") || tab.url === "/") {
      return "Library";
    } else if (tab.url.includes("search")) {
      return "Search";
    } else if (tab.url.includes("settings")) {
      return "Settings";
    }

    return tab.url
      .replace("/", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return {
    createTab,
    closeAndMoveToNextTab,
    tabRouteChange,
    changeTab,
    tabs,
  };
};
