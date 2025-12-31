import {
  HeartPulse,
  Activity,
  Droplet,
  TrendingUp,
  Thermometer,
  Heart,
  CircleEllipsis,
} from "lucide-react";

export const iconMap = {
  ECG: HeartPulse,
  RESPIRATION: Activity,
  SPO2: Droplet,
  NIBP: TrendingUp,
  TEMP: Thermometer,
  PR: Heart,
  CE : CircleEllipsis
} as const;
