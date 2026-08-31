"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Menu,
  ShoppingCart,
  Lock,
  User,
  Package,
  PiggyBank,
  Heart,
  HelpCircle,
  ChevronRight,
  LogOut,
  Users2,
  FileTerminal,
  BookLock,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import AuthPage from "./AuthPage";
import { useLogoutMutation } from "@/store/api/userApi";

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoadingDialogOpen,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [logoutMutation] = useLogoutMutation();
  const cartItemCount = useSelector(
    (state: RootState) => state.cart.items.length,
  );

  const handleSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    router.push(`/sarees?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("use logout successfully");
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };
  const userPlaceholder = user?.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

  const handleProtectedNavigation = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropdownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  };

  const menuItems = [
    ...(user && user
      ? [
          {
            href: "/account/profile",
            content: (
              <div className="flex space-x-4 items-center p-2 border-b ">
                <Avatar className="w-12 h-12 -ml-2 rounded-full ">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt="User" />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>

                <div className="flex flex-col">
                  <span className="font-semibold text-md">
                    {user.name || "Guest User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.email || "No email provided"}
                  </span>
                </div>
              </div>
            ),
          },
        ]
      : [
          {
            icon: <Lock className="h-5 w-5" />,
            label: "Login/Sign Up",
            onClick: handleLoginClick,
          },
        ]),
    {
      icon: <User className="h-5 w-5" />,
      label: "My Profile",
      onClick: () => handleProtectedNavigation("/account/profile"),
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "My Orders",
      onClick: () => handleProtectedNavigation("/account/orders"),
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "My Addresses",
      onClick: () => handleProtectedNavigation("/account/address"),
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Cart",
      onClick: () => handleProtectedNavigation("/checkout/cart"),
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Wishlist",
      onClick: () => handleProtectedNavigation("/account/wishlist"),
    },
    {
      icon: <Users2 className="h-5 w-5" />,
      label: "About Us",
      href: "/about-us",
    },
    {
      icon: <FileTerminal className="h-5 w-5" />,
      label: "Terms & Use",
      href: "/terms-of-use",
    },
    {
      icon: <BookLock className="h-5 w-5" />,
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help",
      href: "/how-it-works",
    },
    ...(user && user
      ? [
          {
            icon: <LogOut className="h-5 w-5" />,
            label: "Logout",
            onClick: handleLogout,
          },
        ]
      : []),
  ];

  const MenuItems = ({ className = "" }) => (
    <div className={className}>
      {menuItems.map((item, index) =>
        item.href ? (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-xs hover:bg-gray-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.content && <div className="mt-1">{item.content}</div>}
            <ChevronRight className="ml-auto h-4 w-4" />
          </Link>
        ) : (
          <button
            key={index}
            onClick={item.onClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-xs hover:bg-gray-200 cursor-pointer"
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </button>
        ),
      )}
    </div>
  );

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      {/* Desktop Header */}
      <div className="w-[95%] mx-auto hidden lg:flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.webp"
            alt="Logo"
            width={50}
            height={50}
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex flex-1 items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search sarees, designs, fabrics, brands..."
              className="w-full rounded-xs border py-5 border-gray-100 bg-gray-100 pr-10 focus:border-gray-100 focus:bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-gray-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              size="icon"
              variant="ghost"
              aria-label="Search"
              className="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-red-50 focus:bg-red-50 focus-visible:bg-red-50 focus-visible:ring-red-200 cursor-pointer"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 text-red-600" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1 ">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                aria-label="Open navigation menu"
                className="rounded-xs cursor-pointer "
              >
                <Avatar className="h-6 w-6 rounded-full" aria-hidden="true">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt="User" />
                  ) : (
                    <AvatarFallback>
                      {userPlaceholder ? (
                        userPlaceholder
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>

                <span className="ml-2">Profile</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-80 p-2">
              <MenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/checkout/cart"
            className="relative inline-flex items-center gap-2 rounded-xs px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />

            <span>Bag</span>

            {user && cartItemCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-1 left-4 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1 text-xs"
              >
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link
            href="/account/wishlist"
            className="relative inline-flex items-center gap-2 rounded-xs px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            <span>Wishlist</span>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="container mx-auto flex lg:hidden items-center justify-between p-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            {/* Add a SheetHeader with SheetTitle */}
            <SheetHeader>
              <SheetTitle className="sr-only"></SheetTitle>
            </SheetHeader>
            <div className="border-b p-4">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={150}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <MenuItems className="py-2" />
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.webp"
            alt="Logo"
            width={50}
            height={50}
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="flex-1 px-4">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              size="icon"
              variant="ghost"
              aria-label="Search"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <Link
          href="/checkout/cart"
          aria-label={
            user && cartItemCount > 0
              ? `Shopping cart, ${cartItemCount} items`
              : "Shopping cart"
          }
          className="relative inline-flex items-center justify-center rounded-xs p-2 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />

          {user && cartItemCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
            >
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>
      {/* Login/Signup Dialog */}
      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
    </header>
  );
}
