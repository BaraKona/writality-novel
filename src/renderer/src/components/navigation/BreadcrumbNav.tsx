import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@renderer/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { Button } from "@renderer/components/ui/button";
import { ReactNode } from "react";

interface BreadcrumbNavProps {
  items: {
    title: string;
    href?: string;
    isCurrentPage?: boolean;
    siblings?: { title: string; href: string }[];
  }[];
  dropdownItems?: {
    title: string;
    href: string;
  }[];
  actions?: ReactNode;
}

export function BreadcrumbNav({
  items,
  dropdownItems,
  actions,
}: BreadcrumbNavProps): JSX.Element {
  return (
    <div className="flex w-full items-center justify-between border-y p-2 py-1">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={item.title}>
              <BreadcrumbItem>
                {item.isCurrentPage ? (
                  item.siblings && item.siblings.length > 0 ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 !px-2 p-1 bg-accent rounded-md text-xs font-medium hover:bg-accent/80"
                        >
                          {item.title}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {item.siblings.map((sibling) => (
                          <DropdownMenuItem key={sibling.href} asChild>
                            <Link
                              to={sibling.href}
                              className="text-xs font-medium px-2 p-1 hover:bg-accent rounded-md cursor-pointer"
                            >
                              {sibling.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <BreadcrumbPage className="text-xs font-medium !px-2 p-1 bg-accent rounded-md">
                      {item.title}
                    </BreadcrumbPage>
                  )
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      to={item.href || "#"}
                      className="text-xs font-medium px-2 p-1 hover:bg-accent rounded-md"
                    >
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
          {dropdownItems && dropdownItems.length > 0 && (
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-accent rounded-md"
                  >
                    <PlusIcon size={16} className="" strokeWidth={2.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        to={item.href}
                        className="text-xs font-medium px-2 p-1 hover:bg-accent rounded-md cursor-pointer"
                      >
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
