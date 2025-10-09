import { PlatformIconProps } from "@/types/calender";
import { platformIcons } from "@/utils/constants";
import Image from "next/image";
import React from "react";

const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 36 }) => {
  const src = platformIcons[platform];
  return src ? (
    <Image src={src} alt={platform} width={size} height={size} />
  ) : null;
};

export default PlatformIcon;
