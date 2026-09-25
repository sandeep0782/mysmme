"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookAudio,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Database,
  Film,
  HelpCircle,
  LayoutDashboard,
  List,
  Menu,
  MessageSquareText,
  Megaphone,
  Package,
  Palette,
  Settings,
  ShoppingBag,
  Store,
  Sun,
  Tag,
  User,
  Users,
  Video,
  X,
} from "lucide-react";

/* ================================================================
   TYPES
================================================================ */

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

type SidebarChild = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  children?: SidebarChild[];
};

/* ================================================================
   MAIN MENU
================================================================ */

const menuItems: SidebarItem[] = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
    href: "/platform/admin",
  },

  /* ==============================================================
     CATALOG MANAGEMENT
  ============================================================== */

  {
    icon: <Package className="h-5 w-5" />,
    label: "Catalog Management",

    children: [
      {
        icon: <Package className="h-4 w-4" />,
        label: "Products",
        href: "/platform/admin/products",
      },

      {
        icon: <Film className="h-4 w-4" />,
        label: "Categories",
        href: "/platform/admin/category",
      },

      {
        icon: <BookAudio className="h-4 w-4" />,
        label: "Article Type",
        href: "/platform/admin/articleType",
      },

      {
        icon: <Tag className="h-4 w-4" />,
        label: "Brands",
        href: "/platform/admin/brand",
      },

      {
        icon: <Palette className="h-4 w-4" />,
        label: "Colors",
        href: "/platform/admin/colors",
      },

      {
        icon: <Sun className="h-4 w-4" />,
        label: "Season",
        href: "/platform/admin/season",
      },
    ],
  },

  /* ==============================================================
     CATALOGUE
  ============================================================== */

  {
    icon: <ClipboardCheck className="h-5 w-5" />,
    label: "Catalogue",

    children: [
      {
        icon: <Package className="h-4 w-4" />,
        label: "Catalogue",
        href: "/platform/admin/catalogue",
      },

      {
        icon: <ClipboardCheck className="h-4 w-4" />,
        label: "Catalogue Approval",
        href: "/platform/admin/catalogue/approval",
      },

      {
        icon: <Database className="h-4 w-4" />,
        label: "Import",
        href: "/platform/admin/import",
      },
    ],
  },

  /* ==============================================================
     SELLER
  ============================================================== */

  {
    icon: <Store className="h-5 w-5" />,
    label: "Seller",
    href: "/platform/admin/seller",
  },
];

/* ================================================================
   BUSINESS / OPERATIONS
================================================================ */

const libraryItems: SidebarItem[] = [
  /* ==============================================================
     SALES
  ============================================================== */

  {
    icon: <ShoppingBag className="h-5 w-5" />,
    label: "Sales",

    children: [
      {
        icon: <List className="h-4 w-4" />,
        label: "Orders",
        href: "/platform/admin/orders",
      },

      {
        icon: <Clock className="h-4 w-4" />,
        label: "Payment",
        href: "/platform/admin/payment",
      },
    ],
  },

  /* ==============================================================
     CUSTOMERS & SUPPORT
  ============================================================== */

  {
    icon: <Users className="h-5 w-5" />,
    label: "Customers & Support",

    children: [
      {
        icon: <User className="h-4 w-4" />,
        label: "Users",
        href: "/platform/admin/users",
      },

      {
        icon: <MessageSquareText className="h-4 w-4" />,
        label: "Contact Enquiries",
        href: "/platform/admin/contact-enquiries",
      },

      {
        icon: <Video className="h-4 w-4" />,
        label: "Reviews",
        href: "/platform/admin/review",
      },
    ],
  },
];

/* ================================================================
   BOTTOM MENU
================================================================ */

const bottomItems: SidebarItem[] = [
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

/* ================================================================
   ROUTE HELPERS
================================================================ */

function isRouteActive(pathname: string, href: string) {
  if (href === "/platform/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/* ================================================================
   SIDEBAR MENU ITEM
================================================================ */

function SidebarMenuItem({
  item,
  isOpen,
  pathname,
  expanded,
  onToggle,
  onNavigate,
  toggleSidebar,
}: {
  item: SidebarItem;

  isOpen: boolean;

  pathname: string;

  expanded?: boolean;

  onToggle?: () => void;

  onNavigate: () => void;

  toggleSidebar: () => void;
}) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  /* ==============================================================
     NORMAL LINK
  ============================================================== */

  if (!hasChildren && item.href) {
    const active = isRouteActive(pathname, item.href);

    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        title={!isOpen ? item.label : undefined}
        className={`
          flex items-center rounded-lg p-2
          transition-all duration-200 ease-in-out

          ${
            active
              ? "bg-red-50 font-semibold text-red-700"
              : "text-slate-700 hover:bg-gray-100 hover:text-slate-900"
          }
        `}
      >
        {/* ICON */}

        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
          {item.icon}
        </div>

        {/* LABEL */}

        <span
          className={`
            origin-left whitespace-nowrap
            transition-all duration-300 ease-in-out

            ${
              isOpen
                ? "ml-3 max-w-full translate-x-0 scale-x-100 opacity-100"
                : "ml-0 max-w-0 -translate-x-1 scale-x-95 overflow-hidden opacity-0"
            }
          `}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  /* ==============================================================
     PARENT MENU
  ============================================================== */

  const children = item.children ?? [];

  /*
    Example:

    /platform/admin/catalogue
    /platform/admin/catalogue/approval

    Both technically match /catalogue.

    Sorting by longest href ensures only
    Catalogue Approval gets active state.
  */

  const matchingChildren = children
    .filter((child) => isRouteActive(pathname, child.href))
    .sort((a, b) => b.href.length - a.href.length);

  const activeChildHref = matchingChildren[0]?.href;

  const childIsActive = Boolean(activeChildHref);

  /* ==============================================================
     PARENT CLICK
  ============================================================== */

  const handleParentClick = () => {
    /*
      If the whole sidebar is collapsed,
      open it first.

      On the next click user can expand
      this parent.
    */

    if (!isOpen) {
      toggleSidebar();
      return;
    }

    onToggle?.();
  };

  return (
    <div>
      {/* ===========================================================
          PARENT BUTTON
      =========================================================== */}

      <button
        type="button"
        onClick={handleParentClick}
        title={!isOpen ? item.label : undefined}
        aria-expanded={isOpen ? Boolean(expanded) : undefined}
        className={`
          flex w-full items-center rounded-lg p-2
          text-left
          transition-all duration-200 ease-in-out

          ${
            childIsActive
              ? "bg-red-50 font-semibold text-red-700"
              : "text-slate-700 hover:bg-gray-100 hover:text-slate-900"
          }
        `}
      >
        {/* ICON */}

        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
          {item.icon}
        </div>

        {/* LABEL */}

        <span
          className={`
            origin-left whitespace-nowrap text-left
            transition-all duration-300 ease-in-out

            ${
              isOpen
                ? "ml-3 max-w-full flex-1 translate-x-0 scale-x-100 opacity-100"
                : "ml-0 max-w-0 -translate-x-1 scale-x-95 overflow-hidden opacity-0"
            }
          `}
        >
          {item.label}
        </span>

        {/* ARROW */}

        {isOpen && (
          <div className="ml-auto flex h-6 w-6 items-center justify-center">
            <ChevronRight
              className={`
                h-4 w-4
                transition-transform duration-300 ease-in-out

                ${expanded ? "rotate-90" : "rotate-0"}
              `}
            />
          </div>
        )}
      </button>

      {/* ===========================================================
          CHILDREN
      =========================================================== */}

      <div
        className={`
          grid
          transition-all duration-300 ease-in-out

          ${
            isOpen && expanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div
            className={`
              ml-4 space-y-1
              border-l border-gray-200
              pl-3

              transition-all duration-300 ease-in-out

              ${
                isOpen && expanded
                  ? "mt-1 translate-y-0"
                  : "mt-0 -translate-y-1"
              }
            `}
          >
            {children.map((child) => {
              const active = activeChildHref === child.href;

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={`
                      flex items-center
                      rounded-lg px-2 py-2

                      text-sm
                      transition-all duration-200 ease-in-out

                      ${
                        active
                          ? "bg-red-50 font-semibold text-red-700"
                          : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                      }
                    `}
                >
                  {/* CHILD ICON */}

                  <div
                    className={`
                        flex h-5 w-5 shrink-0
                        items-center justify-center

                        transition-colors duration-200

                        ${active ? "text-red-700" : "text-slate-500"}
                      `}
                  >
                    {child.icon}
                  </div>

                  {/* CHILD LABEL */}

                  <span className="ml-2.5 whitespace-nowrap">
                    {child.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SIDEBAR
================================================================ */

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();

  /* ==============================================================
     ONE ACTIVE EXPANDED MENU
  ============================================================== */

  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);

  /* ==============================================================
     TOGGLE PARENT MENU
  ============================================================== */

  const toggleMenu = (label: string) => {
    setExpandedMenu((current) => (current === label ? null : label));
  };

  /* ==============================================================
     CLOSE ALL SUBMENUS
  ============================================================== */

  const closeMenus = () => {
    setExpandedMenu(null);
  };

  /* ==============================================================
     AUTO OPEN ACTIVE PARENT
  ============================================================== */

  React.useEffect(() => {
    const allItems = [...menuItems, ...libraryItems];

    const activeParent = allItems.find((item) =>
      item.children?.some((child) => isRouteActive(pathname, child.href)),
    );

    /*
      If current page belongs to a submenu,
      automatically open that parent.

      Example:
      /contact-enquiries/123
      automatically opens Customers & Support.
    */

    if (activeParent) {
      setExpandedMenu(activeParent.label);

      return;
    }

    /*
      If current page is Dashboard,
      Seller, Settings etc.,
      close any open submenu.
    */

    setExpandedMenu(null);
  }, [pathname]);

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <aside
      className={`
        sticky top-0 z-40

        flex h-screen
        flex-shrink-0
        flex-col

        border-r
        border-gray-200
        bg-white

        transition-[width]
        duration-300
        ease-in-out

        will-change-[width]

        ${isOpen ? "w-64" : "w-16"}
      `}
    >
      {/* ===========================================================
          HEADER
      =========================================================== */}

      <div className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 px-2">
        {/* LOGO */}

        <img
          src="/images/logo.webp"
          alt="MYSMME Logo"
          className={`
            h-10 w-14
            flex-shrink-0
            object-contain

            transition-all
            duration-300
            ease-in-out

            ${isOpen ? "mr-2" : "mx-auto"}
          `}
        />

        {/* BRAND */}

        <span
          className={`
            origin-left
            whitespace-nowrap

            text-lg
            font-bold
            text-red-700

            transition-all
            duration-300
            ease-in-out

            ${
              isOpen
                ? "max-w-full translate-x-0 scale-x-100 opacity-100"
                : "max-w-0 -translate-x-1 scale-x-95 overflow-hidden opacity-0"
            }
          `}
        >
          MYSMME
        </span>

        {/* COLLAPSE BUTTON */}

        {isOpen && (
          <button
            type="button"
            onClick={() => {
              closeMenus();
              toggleSidebar();
            }}
            aria-label="Collapse sidebar"
            className="
              ml-auto
              rounded-lg
              p-1.5

              text-slate-600

              transition-all
              duration-200

              hover:bg-gray-100
              hover:text-slate-900
            "
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* ===========================================================
          OPEN BUTTON
      =========================================================== */}

      {!isOpen && (
        <div className="flex flex-shrink-0 justify-center border-b border-gray-100 py-2">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="
              rounded-lg
              p-1.5

              text-slate-600

              transition-all
              duration-200

              hover:bg-gray-100
              hover:text-slate-900
            "
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ===========================================================
          NAVIGATION
      =========================================================== */}

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* =========================================================
            MAIN
        ========================================================= */}

        <div className="space-y-1">
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.label}
              item={item}
              isOpen={isOpen}
              pathname={pathname}
              expanded={expandedMenu === item.label}
              onToggle={() => toggleMenu(item.label)}
              onNavigate={closeMenus}
              toggleSidebar={toggleSidebar}
            />
          ))}
        </div>

        {/* =========================================================
            OPERATIONS
        ========================================================= */}

        <div className="mt-4 space-y-1 border-t border-gray-200 pt-3">
          {libraryItems.map((item) => (
            <SidebarMenuItem
              key={item.label}
              item={item}
              isOpen={isOpen}
              pathname={pathname}
              expanded={expandedMenu === item.label}
              onToggle={() => toggleMenu(item.label)}
              onNavigate={closeMenus}
              toggleSidebar={toggleSidebar}
            />
          ))}
        </div>

        {/* =========================================================
            BOTTOM MENU
        ========================================================= */}

        <div className="mt-4 space-y-1 border-t border-gray-200 pt-3">
          {bottomItems.map((item) => (
            <SidebarMenuItem
              key={item.label}
              item={item}
              isOpen={isOpen}
              pathname={pathname}
              expanded={false}
              onNavigate={closeMenus}
              toggleSidebar={toggleSidebar}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
// "use client";

// import React from "react";
// import Link from "next/link";
// import {
//   Film,
//   Video,
//   Clock,
//   List,
//   ThumbsUp,
//   Settings,
//   HelpCircle,
//   LayoutDashboard,
//   Package,
//   Database,
//   Menu,
//   X,
//   Palette,
//   Sun,
//   Tag,
//   Flag,
//   Megaphone,
//   BookAudio,
//   User,
//   Store,
//   ClipboardCheck,
// } from "lucide-react";

// type SidebarProps = {
//   isOpen: boolean;
//   toggleSidebar: () => void;
// };

// const menuItems = [
//   {
//     icon: <LayoutDashboard className="h-5 w-5" />,
//     label: "Dashboard",
//     href: "/platform/admin",
//   },
//   // {
//   //     icon: <Flag className="h-5 w-5" />,
//   //     label: "Banner",
//   //     href: "/platform/admin/banner",
//   // },
//   {
//     icon: <Sun className="h-5 w-5" />,
//     label: "Season",
//     href: "/platform/admin/season",
//   },
//   {
//     icon: <Tag className="h-5 w-5" />,
//     label: "Brands",
//     href: "/platform/admin/brand",
//   },
//   {
//     icon: <Palette className="h-5 w-5" />,
//     label: "Colors",
//     href: "/platform/admin/colors",
//   },
//   {
//     icon: <Film className="h-5 w-5" />,
//     label: "Categories",
//     href: "/platform/admin/category",
//   },
//   {
//     icon: <Film className="h-5 w-5" />,
//     label: "Products",
//     href: "/platform/admin/products",
//   },
//   {
//     icon: <BookAudio className="h-5 w-5" />,
//     label: "Article Type",
//     href: "/platform/admin/articleType",
//   },
//   {
//     icon: <Package className="h-5 w-5" />,
//     label: "Catalogue",
//     href: "/platform/admin/catalogue",
//   },
//   {
//     icon: <ClipboardCheck className="h-5 w-5" />,
//     label: "Catalogue Approval",
//     href: "/platform/admin/catalogue/approval",
//   },
//   {
//     icon: <Database className="h-5 w-5" />,
//     label: "Import",
//     href: "/platform/admin/import",
//   },
//   {
//     icon: <Store className="h-5 w-5" />,
//     label: "Seller",
//     href: "/platform/admin/seller",
//   },
// ];

// const libraryItems = [
//   {
//     icon: <User className="h-5 w-5" />,
//     label: "Users",
//     href: "/platform/admin/users",
//   },
//   {
//     icon: <List className="h-5 w-5" />,
//     label: "Orders",
//     href: "/platform/admin/orders",
//   },
//   {
//     icon: <Clock className="h-5 w-5" />,
//     label: "Payment",
//     href: "/platform/admin/payment",
//   },
//   {
//     icon: <Video className="h-5 w-5" />,
//     label: "Review",
//     href: "/platform/admin/review",
//   },
//   {
//     icon: <Clock className="h-5 w-5" />,
//     label: "Watch Later",
//     href: "/platform/admin/watch-later",
//   },
//   {
//     icon: <ThumbsUp className="h-5 w-5" />,
//     label: "Liked Videos",
//     href: "/platform/admin/liked",
//   },
// ];

// const bottomItems = [
//   {
//     icon: <Megaphone className="h-5 w-5" />,
//     label: "Advertise",
//     href: "/platform/admin/advertise",
//   },
//   {
//     icon: <Settings className="h-5 w-5" />,
//     label: "Settings",
//     href: "/platform/admin/settings",
//   },
//   {
//     icon: <HelpCircle className="h-5 w-5" />,
//     label: "Help",
//     href: "/platform/admin/help",
//   },
// ];

// const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
//   return (
//     <aside
//       className={`
//                 sticky top-0 z-40
//                 flex h-screen flex-shrink-0 flex-col
//                 border-r bg-white
//                 transition-[width]
//                 duration-300
//                 ease-in-out
//                 ${isOpen ? "w-64" : "w-16"}
//             `}
//     >
//       {/* Header */}
//       <div className="flex h-16 flex-shrink-0 items-center border-b px-2">
//         {/* Logo */}
//         <img
//           src="/images/logo.webp"
//           alt="MYSMME Logo"
//           className={`
//                         h-10 w-14 flex-shrink-0
//                         transition-all duration-300
//                         ${isOpen ? "mr-2" : "mx-auto"}
//                     `}
//         />

//         {/* Brand */}
//         <span
//           className={`
//                         whitespace-nowrap text-lg font-bold
//                         transition-all duration-300 text-red-700
//                         ${
//                           isOpen
//                             ? "max-w-full opacity-100"
//                             : "max-w-0 overflow-hidden opacity-0"
//                         }
//                     `}
//         >
//           MYSMME
//         </span>

//         {/* Close */}
//         {isOpen && (
//           <button
//             type="button"
//             onClick={toggleSidebar}
//             aria-label="Collapse sidebar"
//             className="ml-auto rounded p-1 transition hover:bg-gray-200"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         )}
//       </div>

//       {/* Open button when collapsed */}
//       {!isOpen && (
//         <div className="flex flex-shrink-0 justify-center py-2">
//           <button
//             type="button"
//             onClick={toggleSidebar}
//             aria-label="Open sidebar"
//             className="rounded p-1 transition hover:bg-gray-200"
//           >
//             <Menu className="h-5 w-5" />
//           </button>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto px-2 py-2">
//         {/* Main */}
//         <div className="space-y-1">
//           {menuItems.map(({ icon, label, href }) => (
//             <Link
//               key={href}
//               href={href}
//               className="
//                                     flex items-center
//                                     rounded-lg p-2
//                                     text-slate-700
//                                     transition
//                                     hover:bg-gray-100
//                                 "
//             >
//               <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
//                 {icon}
//               </div>

//               <span
//                 className={`
//                                         whitespace-nowrap
//                                         transition-all duration-300
//                                         ${
//                                           isOpen
//                                             ? "ml-3 max-w-full opacity-100"
//                                             : "ml-0 max-w-0 overflow-hidden opacity-0"
//                                         }
//                                     `}
//               >
//                 {label}
//               </span>
//             </Link>
//           ))}
//         </div>

//         {/* Library */}
//         <div className="mt-4 space-y-1 border-t pt-3">
//           {libraryItems.map(({ icon, label, href }) => (
//             <Link
//               key={href}
//               href={href}
//               className="
//                                     flex items-center
//                                     rounded-lg p-2
//                                     text-slate-700
//                                     transition
//                                     hover:bg-gray-100
//                                 "
//             >
//               <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
//                 {icon}
//               </div>

//               <span
//                 className={`
//                                         whitespace-nowrap
//                                         transition-all duration-300
//                                         ${
//                                           isOpen
//                                             ? "ml-3 max-w-full opacity-100"
//                                             : "ml-0 max-w-0 overflow-hidden opacity-0"
//                                         }
//                                     `}
//               >
//                 {label}
//               </span>
//             </Link>
//           ))}
//         </div>

//         {/* Bottom */}
//         <div className="mt-4 space-y-1 border-t pt-3">
//           {bottomItems.map(({ icon, label, href }) => (
//             <Link
//               key={href}
//               href={href}
//               className="
//                                     flex items-center
//                                     rounded-lg p-2
//                                     text-slate-700
//                                     transition
//                                     hover:bg-gray-100
//                                 "
//             >
//               <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
//                 {icon}
//               </div>

//               <span
//                 className={`
//                                         whitespace-nowrap
//                                         transition-all duration-300
//                                         ${
//                                           isOpen
//                                             ? "ml-3 max-w-full opacity-100"
//                                             : "ml-0 max-w-0 overflow-hidden opacity-0"
//                                         }
//                                     `}
//               >
//                 {label}
//               </span>
//             </Link>
//           ))}
//         </div>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
