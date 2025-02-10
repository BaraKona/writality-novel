import { ChevronRight, type LucideIcon } from 'lucide-react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@renderer/components/ui/sidebar'
import React from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode | LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const [animate] = useAutoAnimate()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
            ref={(el) => {
              if (el) {
                animate
              }
            }}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                className={`${location.pathname === item.url ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                onClick={() => {
                  navigate({
                    to: item.url
                  })
                }}
              >
                {item.icon && React.isValidElement(item.icon)
                  ? item.icon
                  : item.icon
                    ? React.createElement(item.icon as React.ElementType)
                    : null}
                <span>{item.title}</span>
                <CollapsibleTrigger
                  asChild
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarMenuButton>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          to={subItem.url}
                          activeProps={{
                            className: 'bg-sidebar-accent text-sidebar-accent-foreground'
                          }}
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
