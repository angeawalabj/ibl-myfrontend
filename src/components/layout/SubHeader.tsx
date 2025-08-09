"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface LinkItem {
  href: string;
  label: string;
}

interface SubHeaderProps {
  links: LinkItem[];
  activeColorClass?: string;
}

export default function SubHeader({ links, activeColorClass = "blue" }: SubHeaderProps) {
  const pathname = usePathname();

  const activeBg = `bg-${activeColorClass}-600`;
  const activeText = "text-white";
  const inactiveText = `text-${activeColorClass}-600`;
  const hoverBg = `hover:bg-${activeColorClass}-100`;
  const border = `border-${activeColorClass}-200`;
  const bg = `bg-${activeColorClass}-50`;

  return (
    <div className={`w-full ${bg} border-b ${border}`}>
      <div className="max-w-screen-xl mx-auto px-4 py-2 flex flex-wrap gap-3 overflow-x-auto">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm px-3 py-1 rounded-md transition-colors whitespace-nowrap",
                isActive ? `${activeBg} ${activeText}` : `${inactiveText} ${hoverBg}`
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
