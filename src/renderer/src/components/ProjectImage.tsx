import { FC } from "react";

export const ProjectImage: FC<{ image: string }> = ({ image }) => {
  return (
    <img
      className="w-full flex items-center gap-2 text-sm h-14 rounded-lg cursor-default object-cover bg-no-repeat bg-center ring-1 ring-sidebar-border"
      src={image}
    ></img>
  );
};
