"use client";

import React from 'react';
import {
  FilePenLine,
  Palette,
  Rocket,
  BarChart3,
  TrendingUp,
  Target,
  Search,
  PieChart,
  Users,
  BrainCircuit,
  Lightbulb,
  Map,
  Clock,
  Globe,
  RefreshCw,
  CalendarDays,
  CalendarPlus,
  Columns,
  Bell,
  Recycle,
  Smartphone,
  Zap,
  MessageSquare,
  TestTube2,
  SlidersHorizontal,
  LucideProps,
} from 'lucide-react';

/**
 * A map of all available icons from lucide-react.
 * This allows us to dynamically render icons based on a string name.
 */
export const Icons = {
  FilePenLine,
  Palette,
  Rocket,
  BarChart3,
  TrendingUp,
  Target,
  Search,
  PieChart,
  Users,
  BrainCircuit,
  Lightbulb,
  Map,
  Clock,
  Globe,
  RefreshCw,
  CalendarDays,
  CalendarPlus,
  Columns,
  Bell,
  Recycle,
  Smartphone,
  Zap,
  MessageSquare,
  TestTube2,
  SlidersHorizontal,
};

interface IconProps extends LucideProps {
  name: keyof typeof Icons;
}

/**
 * Renders a Lucide icon dynamically based on the provided name.
 * @param {IconProps} props - The component props.
 * @param {keyof typeof Icons} props.name - The name of the icon to render.
 * @returns A Lucide icon component or null if the name is not found.
 */
const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    // You can return a default icon here if you want
    return null;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
