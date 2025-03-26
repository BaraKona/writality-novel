import { Image, Globe2Icon, SquareUser, LucideIcon } from "lucide-react";
import { useCurrentDir } from "@renderer/hooks/useProjectDir";

export const data = (): {
  openProject: { name: string };
  navMain: {
    title: string;
    url: string;
    icon: React.ReactNode | LucideIcon;
    items: { title: string; url: string }[];
  }[];
} => {
  const { data: projectDir } = useCurrentDir();

  return {
    openProject: {
      name: projectDir?.name || "Untitled",
    },
    navMain: [
      {
        title: "World",
        url: "/world",
        icon: Globe2Icon,
        // isActive: true,
        items: [
          {
            title: "Map",
            url: "/world/map",
          },
          {
            title: "History",
            url: "/world/history",
          },
          {
            title: "Notes",
            url: "/world/notes",
          },
        ],
      },
      {
        title: "Gallery",
        url: "/gallery",
        icon: Image,
        items: [
          {
            title: "Inspiration",
            url: "/gallery/inspiration",
          },
          {
            title: "People",
            url: "/gallery/people",
          },
          {
            title: "World",
            url: "/gallery/world",
          },
          {
            title: "Miscellaneous",
            url: "/gallery/miscellaneous",
          },
        ],
      },
      {
        title: "People",
        url: "/people",
        icon: SquareUser,
        items: [
          {
            title: "Characters",
            url: "/people/characters",
          },
          {
            title: "Cultures",
            url: "/people/cultures",
          },
        ],
      },
    ],
  };
};
