"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  List,
  Clock,
  Video,
  User,
  Settings,
  HelpCircle,
  Menu,
  X,
  Megaphone,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const menuItems = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
    href: "/platform/seller",
  },
  {
    icon: <Package className="h-5 w-5" />,
    label: "Catalogue",
    href: "/platform/seller/catalogue",
  },
];

const orderItems = [
  {
    icon: <List className="h-5 w-5" />,
    label: "Orders",
    href: "/platform/seller/orders",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Payment",
    href: "/platform/seller/payment",
  },
  {
    icon: <Video className="h-5 w-5" />,
    label: "Reviews",
    href: "/platform/seller/review",
  },
];

const bottomItems = [
  {
    icon: <Megaphone className="h-5 w-5" />,
    label: "Advertise",
    href: "/platform/seller/advertise",
  },
  {
    icon: <User className="h-5 w-5" />,
    label: "Profile",
    href: "/platform/seller/profile",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
    href: "/platform/seller/settings",
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    label: "Help",
    href: "/platform/seller/help",
  },
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const renderMenuItems = (items: typeof menuItems) =>
    items.map(({ icon, label, href }) => (
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
    ));

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
        <img
          src="/images/logo.webp"
          alt="MYSMME Logo"
          className={`
                        h-10 w-14 flex-shrink-0
                        transition-all duration-300
                        ${isOpen ? "mr-2" : "mx-auto"}
                    `}
        />

        <span
          className={`
                        whitespace-nowrap
                        text-lg font-bold text-red-700
                        transition-all duration-300
                        ${
                          isOpen
                            ? "max-w-full opacity-100"
                            : "max-w-0 overflow-hidden opacity-0"
                        }
                    `}
        >
          MYSMME
        </span>

        {isOpen && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="
                            ml-auto rounded p-1
                            transition hover:bg-gray-200
                        "
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Open button */}
      {!isOpen && (
        <div className="flex flex-shrink-0 justify-center py-2">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="
                            rounded p-1
                            transition hover:bg-gray-200
                        "
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* Main */}
        <div className="space-y-1">{renderMenuItems(menuItems)}</div>

        {/* Orders */}
        <div className="mt-4 space-y-1 border-t pt-3">
          {renderMenuItems(orderItems)}
        </div>

        {/* Bottom */}
        <div className="mt-4 space-y-1 border-t pt-3">
          {renderMenuItems(bottomItems)}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
