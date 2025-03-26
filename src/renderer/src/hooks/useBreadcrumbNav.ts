import { useMatches } from "@tanstack/react-router";
import { data as getSidebarData } from "@renderer/components/sidebar/sidebarData";

interface BreadcrumbItem {
  title: string;
  href?: string;
  isCurrentPage: boolean;
}

interface DropdownItem {
  title: string;
  href: string;
}

interface BreadcrumbNavData {
  items: BreadcrumbItem[];
  dropdownItems: DropdownItem[];
}

export function useBreadcrumbNav(): BreadcrumbNavData {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1].pathname;
  const sidebarData = getSidebarData();

  // Find the current section and its items
  const currentSection = sidebarData.navMain.find((section) =>
    currentPath.startsWith(section.url),
  );

  if (!currentSection) {
    return {
      items: [],
      dropdownItems: [],
    };
  }

  // Normalize paths for comparison
  const normalizedCurrentPath = currentPath.endsWith("/")
    ? currentPath.slice(0, -1)
    : currentPath;
  const normalizedSectionUrl = currentSection.url.endsWith("/")
    ? currentSection.url.slice(0, -1)
    : currentSection.url;

  // Create breadcrumb items
  const items: BreadcrumbItem[] = [
    {
      title: currentSection.title,
      href: currentSection.url,
      isCurrentPage: normalizedCurrentPath === normalizedSectionUrl,
    },
  ];

  // If we're in a subsection, add it to the breadcrumb
  const currentSubsection = currentSection.items.find(
    (item) => item.url === currentPath,
  );
  if (currentSubsection) {
    items.push({
      title: currentSubsection.title,
      isCurrentPage: true,
    });
  }

  // Add dropdown items only on the main section page
  const dropdownItems: DropdownItem[] =
    normalizedCurrentPath === normalizedSectionUrl
      ? currentSection.items.map((item) => ({
          title: item.title,
          href: item.url,
        }))
      : [];

  return {
    items,
    dropdownItems,
  };
}
