import {
  Home,
  Building2,
  ClipboardList,
  Clock3,
  User,
} from "lucide-react";

export const bottomNavItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/properties",
    label: "Properties",
    icon: Building2,
  },
  {
    href: "/needs",
    label: "Needs",
    icon: ClipboardList,
  },
  {
    href: "/follow-ups",
    label: "Follow-ups",
    icon: Clock3,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];