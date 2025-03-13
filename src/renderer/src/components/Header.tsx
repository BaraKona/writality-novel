import { Separator } from "@radix-ui/react-separator";
import { PrimaryNavbar } from "./PrimaryNavbar";
import { FC } from "react";

export const Header: FC = () => {
  return (
    <nav className="flex w-full items-center gap-2 overflow-x-auto bg-background">
      <div className="flex w-full grow items-center gap-2 overflow-x-auto">
        <Separator orientation="vertical" className="h-4 shrink-0" />
        <PrimaryNavbar />
      </div>
    </nav>
  );
};
