"use client";

import React from "react";
import Link from "next/link";
import {
  Film,
  Video,
  Clock,
  List,
  ThumbsUp,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Package,
  Database,
  Menu,
  X,
  Palette,
  Sun,
  Tag,
  Flag,
  Megaphone,
  BookAudio,
  User,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const menuItems = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
    href: "/platform/admin",
  },
  // {
  //     icon: <Flag className="h-5 w-5" />,
  //     label: "Banner",
  //     href: "/platform/admin/banner",
  // },
  {
    icon: <Sun className="h-5 w-5" />,
    label: "Season",
    href: "/platform/admin/season",
  },
  {
    icon: <Tag className="h-5 w-5" />,
    label: "Brands",
    href: "/platform/admin/brand",
  },
  {
    icon: <Palette className="h-5 w-5" />,
    label: "Colors",
    href: "/platform/admin/colors",
  },
  {
    icon: <Film className="h-5 w-5" />,
    label: "Categories",
    href: "/platform/admin/category",
  },
  {
    icon: <Film className="h-5 w-5" />,
    label: "Products",
    href: "/platform/admin/products",
  },
  {
    icon: <BookAudio className="h-5 w-5" />,
    label: "Article Type",
    href: "/platform/admin/articleType",
  },
  {
    icon: <Package className="h-5 w-5" />,
    label: "Catalogue",
    href: "/platform/admin/catalogue",
  },
  {
    icon: <Database className="h-5 w-5" />,
    label: "Import",
    href: "/platform/admin/import",
  },
];

const libraryItems = [
  {
    icon: <User className="h-5 w-5" />,
    label: "Users",
    href: "/platform/admin/users",
  },
  {
    icon: <List className="h-5 w-5" />,
    label: "Orders",
    href: "/platform/admin/orders",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Payment",
    href: "/platform/admin/payment",
  },
  {
    icon: <Video className="h-5 w-5" />,
    label: "Review",
    href: "/platform/admin/review",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Watch Later",
    href: "/platform/admin/watch-later",
  },
  {
    icon: <ThumbsUp className="h-5 w-5" />,
    label: "Liked Videos",
    href: "/platform/admin/liked",
  },
];

const bottomItems = [
  {
    icon: <Megaphone className="h-5 w-5" />,
    label: "Advertise",
    href: "/platform/admin/advertise",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
    href: "/platform/admin/settings",
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    label: "Help",
    href: "/platform/admin/help",
  },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  return (
    <aside
      className={`
                sticky top-0 z-40
                flex h-screen flex-shrink-0 flex-col
                border-r bg-white
                transition-[width]
                duration-300
                ease-in-out
                ${isOpen ? "w-64" : "w-16"}
            `}
    >
      {/* Header */}
      <div className="flex h-16 flex-shrink-0 items-center border-b px-2">
        {/* Logo */}
        <img
          src="/images/logo.webp"
          alt="MYSMME Logo"
          className={`
                        h-10 w-14 flex-shrink-0
                        transition-all duration-300
                        ${isOpen ? "mr-2" : "mx-auto"}
                    `}
        />

        {/* Brand */}
        <span
          className={`
                        whitespace-nowrap text-lg font-bold
                        transition-all duration-300 text-red-700
                        ${
                          isOpen
                            ? "max-w-full opacity-100"
                            : "max-w-0 overflow-hidden opacity-0"
                        }
                    `}
        >
          MYSMME
        </span>

        {/* Close */}
        {isOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="ml-auto rounded p-1 transition hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Open button when collapsed */}
      {!isOpen && (
        <div className="flex flex-shrink-0 justify-center py-2">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="rounded p-1 transition hover:bg-gray-200"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* Main */}
        <div className="space-y-1">
          {menuItems.map(({ icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className="
                                    flex items-center
                                    rounded-lg p-2
                                    text-slate-700
                                    transition
                                    hover:bg-gray-100
                                "
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                {icon}
              </div>

              <span
                className={`
                                        whitespace-nowrap
                                        transition-all duration-300
                                        ${
                                          isOpen
                                            ? "ml-3 max-w-full opacity-100"
                                            : "ml-0 max-w-0 overflow-hidden opacity-0"
                                        }
                                    `}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* Library */}
        <div className="mt-4 space-y-1 border-t pt-3">
          {libraryItems.map(({ icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className="
                                    flex items-center
                                    rounded-lg p-2
                                    text-slate-700
                                    transition
                                    hover:bg-gray-100
                                "
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                {icon}
              </div>

              <span
                className={`
                                        whitespace-nowrap
                                        transition-all duration-300
                                        ${
                                          isOpen
                                            ? "ml-3 max-w-full opacity-100"
                                            : "ml-0 max-w-0 overflow-hidden opacity-0"
                                        }
                                    `}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-4 space-y-1 border-t pt-3">
          {bottomItems.map(({ icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className="
                                    flex items-center
                                    rounded-lg p-2
                                    text-slate-700
                                    transition
                                    hover:bg-gray-100
                                "
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                {icon}
              </div>

              <span
                className={`
                                        whitespace-nowrap
                                        transition-all duration-300
                                        ${
                                          isOpen
                                            ? "ml-3 max-w-full opacity-100"
                                            : "ml-0 max-w-0 overflow-hidden opacity-0"
                                        }
                                    `}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
