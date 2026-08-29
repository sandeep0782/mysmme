"use client";

import {
  Check,
  Heart,
  Loader2,
  ShoppingCart,
  Trash2,
  Package,
  IndianRupee,
  Eye,
} from "lucide-react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/api/wishlistApi";

import { useAddToCartMutation } from "@/store/api/cartApi";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { removeFromWishlistAction } from "@/store/slice/wishlistSlice";
import toast from "react-hot-toast";

import BookLoader from "@/lib/Spinner";
import NoData from "@/lib/NoData";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { addToCart } from "@/store/slice/cartSlice";
import { BookDetails } from "@/types/product";

export default function WishlistPage() {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const cart = useSelector((state: RootState) => state.cart.items);

  const dispatch = useDispatch();
  const router = useRouter();

  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const [addToCartMutation] = useAddToCartMutation();
  const user = useSelector((state: RootState) => state.user.user);

  const { data: wishListData, isLoading } = useGetWishlistQuery(user?._id, {
    skip: !user?._id,
  });
  const [wishlistItems, setWishlistItems] = useState<BookDetails[]>([]);

  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  /* ===================================================== */
  /* LOAD WISHLIST                                          */
  /* ===================================================== */

  useEffect(() => {
    if (wishListData?.success) {
      setWishlistItems(wishListData.data.products || []);
    }
  }, [wishListData]);

  /* ===================================================== */
  /* REMOVE FROM WISHLIST                                   */
  /* ===================================================== */

  const toggleWishlist = async (productId: string) => {
    try {
      const isInWishlist = wishlist.some((item) =>
        item.products.includes(productId),
      );

      if (!isInWishlist) return;

      const result = await removeFromWishlist(productId).unwrap();

      if (result.success) {
        dispatch(removeFromWishlistAction(productId));

        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== productId),
        );

        toast.success("Removed from wishlist");
      } else {
        throw new Error(result.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to update wishlist");
    }
  };

  /* ===================================================== */
  /* ADD TO CART                                            */
  /* ===================================================== */

  const handleAddToCart = async (productId: string) => {
    setAddingProductId(productId);

    try {
      const result = await addToCartMutation({
        productId,
        quantity: 1,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(addToCart(result.data));

        toast.success(result.message || "Added to cart successfully!");
      } else {
        throw new Error(result.message || "Failed to add to cart");
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Failed to add item to cart";

      toast.error(errorMessage);
    } finally {
      setAddingProductId(null);
    }
  };

  /* ===================================================== */
  /* CART CHECK                                             */
  /* ===================================================== */

  const isItemInCart = (productId: string) => {
    return cart.some((cartItem) => cartItem.product._id === productId);
  };

  /* ===================================================== */
  /* LOADING                                                */
  /* ===================================================== */

  if (isLoading) {
    return <BookLoader />;
  }

  /* ===================================================== */
  /* EMPTY STATE                                            */
  /* ===================================================== */

  if (!wishlistItems.length) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <NoData
          message="Your wishlist is empty."
          description="Looks like you haven't added any items to your wishlist yet. Browse our collection and save your favorites!"
          buttonText="Browse Products"
          imageUrl="/images/wishlist.webp"
          onClick={() => router.push("/products")}
        />
      </div>
    );
  }

  /* ===================================================== */
  /* PAGE                                                   */
  /* ===================================================== */

  return (
    <div className="space-y-5">
      {/* ================================================= */}
      {/* SUMMARY */}
      {/* ================================================= */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={<Heart className="h-4 w-4" />}
          label="Wishlist Items"
          value={wishlistItems.length}
          color="red"
        />

        <SummaryCard
          icon={<ShoppingCart className="h-4 w-4" />}
          label="In Cart"
          value={wishlistItems.filter((item) => isItemInCart(item._id)).length}
          color="orange"
        />

        <SummaryCard
          icon={<Package className="h-4 w-4" />}
          label="Available"
          value={wishlistItems.filter((item) => !isItemInCart(item._id)).length}
          color="green"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* ================================================= */}
      {/* WISHLIST TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              My Wishlist
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">Your saved products</p>
          </div>

          <span className="w-fit rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* ================================================= */}
        {/* DESKTOP TABLE */}
        {/* ================================================= */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-white">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Price
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {wishlistItems.map((item) => {
                const inCart = isItemInCart(item._id);

                const isAdding = addingProductId === item._id;

                return (
                  <tr
                    key={item._id}
                    className="group transition-colors hover:bg-orange-50/30"
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Image */}
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          {item.images?.[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.title}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <p className="max-w-[260px] truncate text-sm font-semibold text-slate-900">
                            {item.title}
                          </p>

                          {item.author && (
                            <p className="mt-0.5 max-w-[240px] truncate text-xs text-slate-400">
                              {item.author}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {item.subject || "Product"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-0.5 text-sm font-bold text-slate-900">
                        <IndianRupee className="h-3.5 w-3.5" />

                        {item.finalPrice.toLocaleString("en-IN")}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {inCart ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          <Check className="h-3.5 w-3.5" />
                          In Cart
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          Available
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleWishlist(item._id)}
                          className="h-9 w-9 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {inCart ? (
                          <Button
                            disabled
                            size="sm"
                            className="h-9 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Check className="mr-1.5 h-4 w-4" />
                            In Cart
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item._id)}
                            disabled={isAdding}
                            className="h-9 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm hover:from-orange-600 hover:to-amber-600"
                          >
                            {isAdding ? (
                              <>
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                Adding
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="mr-1.5 h-4 w-4" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================================================= */}
        {/* MOBILE CARDS */}
        {/* ================================================= */}

        <div className="divide-y divide-slate-100 md:hidden">
          {wishlistItems.map((item) => {
            const inCart = isItemInCart(item._id);

            const isAdding = addingProductId === item._id;

            return (
              <div key={item._id} className="space-y-4 p-4">
                {/* Product */}
                <div className="flex gap-3">
                  {/* Image */}
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {item.title}
                        </p>

                        {item.author && (
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {item.author}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleWishlist(item._id)}
                        className="h-8 w-8 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        {item.subject || "Product"}
                      </span>
                    </div>

                    <p className="mt-2 text-base font-bold text-slate-900">
                      ₹{item.finalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  {inCart ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                      <Check className="h-3.5 w-3.5" />
                      Already in cart
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Ready to purchase
                    </span>
                  )}

                  {inCart ? (
                    <Button
                      disabled
                      size="sm"
                      variant="outline"
                      className="border-emerald-200 text-emerald-700"
                    >
                      <Check className="mr-1.5 h-4 w-4" />
                      In Cart
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item._id)}
                      disabled={isAdding}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          Adding
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-1.5 h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SUMMARY CARD                                               */
/* ========================================================= */

function SummaryCard({
  icon,
  label,
  value,
  color,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "red" | "orange" | "green";
  className?: string;
}) {
  const colors = {
    red: {
      icon: "bg-red-100 text-red-600",
    },

    orange: {
      icon: "bg-orange-100 text-orange-600",
    },

    green: {
      icon: "bg-emerald-100 text-emerald-600",
    },
  };

  const current = colors[color];

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${current.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">{label}</p>

          <p className="mt-0.5 text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
