"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavItems } from "@/lib/constants/navigation";

export function BottomNav() {
  const pathname = usePathname();  
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-18 max-w-md items-center justify-around px-2">
        {bottomNavItems.map((item) => {
            const isActive =
                item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
                <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors ${
                    isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                >
                <item.icon
                  className={`h-6 w-6 ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                />
                <span className="text-[11px] font-medium">
                  {item.label}
                </span>
                </Link>
            );
            })}
      </div>
    </nav>
  );
}