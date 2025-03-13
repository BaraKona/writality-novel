import { FC } from "react";
import { Tab } from "@shared/models";
import { Button } from "@renderer/components/ui/button";
import {
  BookTextIcon,
  BarChart,
  FileText,
  Globe2Icon,
  ImageIcon,
  BlocksIcon,
  LibraryBigIcon,
  SettingsIcon,
  SquareUserIcon,
  TrashIcon,
  HelpCircle,
  X,
  Flower2,
  CirclePlus,
  LibraryBig,
} from "lucide-react";

export const TabListItem: FC<{
  tab: Tab;
  removeTab: (tab: Tab) => void;
  changeTab: () => void;
}> = ({ tab, removeTab, changeTab }) => {
  console.log({ tab });
  return (
    <Button
      onClick={changeTab}
      variant="outline"
      size="sm"
      className={`${tab.active && "bg-accent"} hover:bg-accent rounded-md flex gap-1 h-auto py-1 cursor-default items-center text-left justify-start text-xs group w-48 capitalize shrink-0`}
    >
      <span className="shrink-0 stroke-muted-foreground">
        {iconList(tab.url)}
      </span>
      <span className="grow w-full truncate text-muted-foreground">
        {tab.name}
      </span>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          removeTab(tab);
        }}
        variant="ghost"
        size="sm"
        className={`group-hover:visible ml-auto flex px-0 items-center ${tab.active ? "" : "invisible "}`}
      >
        <X size={12} strokeWidth={1.5} />
      </Button>
    </Button>
  );
};

function iconList(tabUrl: string | undefined): JSX.Element {
  if (!tabUrl) {
    return <Flower2 size={16} strokeWidth={1.5} />;
  }

  const size = 16;
  const stroke = 1.5;
  if (tabUrl.includes("home") || tabUrl === "/") {
    return <LibraryBigIcon size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("overview")) {
    return <LibraryBig size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("settings")) {
    return <SettingsIcon size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("chapter")) {
    return <FileText size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes(".canvas")) {
    return <BlocksIcon size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("bin")) {
    return <TrashIcon size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("analytics") || tabUrl.includes("stats")) {
    return <BarChart size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("new")) {
    return <CirclePlus size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("world")) {
    return <Globe2Icon size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("gallery")) {
    return <ImageIcon size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("characters")) {
    return <SquareUserIcon size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("storyboard")) {
    return <BookTextIcon size={size} strokeWidth={stroke} />;
  } else if (tabUrl.includes("help")) {
    return <HelpCircle size={size} strokeWidth={stroke} />;
  } else {
    return <Flower2 size={size} strokeWidth={stroke} />;
  }
}
