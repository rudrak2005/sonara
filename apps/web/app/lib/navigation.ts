import {
  Home,
  Search,
  Library,
  Activity,
  Brain,
  CassetteTape,
  Heart,
  Sparkles,
  Users,
  Settings,
  Shield,
  
} from "lucide-react";


export const mainNavigation = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
{
  href: "/sonora/search",
  label: "Search",
  icon: Search,
},
  {
    label: "Library",
    href: "/library",
    icon: Library,
  },
  {
    label: "Pulse",
    href: "/pulse",
    icon: Activity,
  },
  {
    label: "Music DNA",
    href: "/music-dna",
    icon: Brain,
  },
  {
    label: "Tapes",
    href: "/tapes",
    icon: CassetteTape,
  },
  {
    label: "Memories",
    href: "/memories",
    icon: Heart,
  },
  {
    label: "AI DJ",
    href: "/ai",
    icon: Sparkles,
  },
  {
    label: "Together",
    href: "/together",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
  href: "/privacy",
  label: "Privacy",
  icon: Shield,
},
] as const;