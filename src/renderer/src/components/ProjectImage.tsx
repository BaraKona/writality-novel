import { FC } from "react";
import defaultBannerImage from '@renderer/assets/images/default_banner_image.jpeg'

export const ProjectImage: FC = () => {
  return(
    <img
      className="flex items-center gap-2 text-sm h-14 rounded-md cursor-default object-cover bg-no-repeat bg-center mb-1 shadow-md "
      src={defaultBannerImage}
    ></img>
  )
}