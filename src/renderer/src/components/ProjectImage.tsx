import { FC } from "react";
import defaultBannerImage from '@renderer/assets/images/fantasy-endless-hole-landscape.jpg'

export const ProjectImage: FC = () => {
  return(
    <img
      className="w-full transition-transform duration-200 ease-linear flex items-center gap-2 text-sm h-14 rounded-md cursor-default object-cover bg-no-repeat bg-center mb-1 shadow-md "
      src={defaultBannerImage}
    ></img>
  )
}