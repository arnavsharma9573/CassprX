import { PlatformIconProps } from '@/types/calender';
import { platformIcons } from '@/utils/constants';
import React from 'react';


const PlatformIcon: React.FC<PlatformIconProps> = ({ platform }) => {
    const IconComponent = platformIcons[platform];
    return IconComponent ? <IconComponent size={16} /> : null;
};

export default PlatformIcon;
