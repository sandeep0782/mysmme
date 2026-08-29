import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CartItem } from "@/types/product";

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  wishlist: { products: string[] }[];
}

export const CartItems: React.FC<CartItemsProps> = ({
  items,
  onRemoveItem,
  onToggleWishlist,
  onQuantityChange,
  wishlist,
}) => {
  return (
    <ScrollArea className="h-[500px] pr-3">
      <div className="space-y-1">
        {items.map((item) => {
          const isInWishlist = wishlist.some((w) =>
            w.products.includes(item.product._id),
          );

          const discount =
            item.product.price > 0
              ? Math.round(
                  ((item.product.price - item.product.finalPrice) /
                    item.product.price) *
                    100,
                )
              : 0;

          return (
            <div
              key={item._id}
              className="group relative flex gap-4 border-b border-gray-100 py-5 last:border-0"
            >
              {/* Product Image */}
              <Link
                href={`/products/${item.product.slug}`}
                className="shrink-0"
              >
                <div className="relative flex h-24 w-20 items-center justify-center overflow-hidden rounded-lg bg-gray-50 md:h-28 md:w-24">
                  <Image
                    src={item?.product?.images?.[0] || "/placeholder.png"}
                    alt={item?.product?.title || "Product Image"}
                    fill
                    sizes="96px"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Product Details */}
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors hover:text-red-600 md:text-base">
                    {item.product.title}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-gray-900">
                    ₹
                    {Number(item.product.finalPrice ?? 0).toLocaleString(
                      "en-IN",
                    )}
                  </span>

                  {item.product.price > item.product.finalPrice && (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item.product.price.toLocaleString("en-IN")}
                      </span>

                      <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Shipping */}
                <p className="mt-1 text-xs font-medium text-green-600">
                  {String(item.product.shippingCharge).toLowerCase() === "free"
                    ? "✓ Free Shipping"
                    : `Shipping: ₹${item.product.shippingCharge}`}
                </p>

                {/* Quantity + Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  {/* Quantity Selector */}
                  <div className="flex h-9 items-center rounded-md border border-gray-200 bg-white">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none hover:bg-gray-50"
                      onClick={() =>
                        onQuantityChange(item.product._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>

                    <span className="flex h-8 w-9 items-center justify-center border-x border-gray-200 text-sm font-medium">
                      {item.quantity}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none hover:bg-gray-50"
                      onClick={() =>
                        onQuantityChange(item.product._id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onRemoveItem(item.product._id)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 text-xs ${
                        isInWishlist
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                      }`}
                      onClick={() => onToggleWishlist(item.product._id)}
                    >
                      <Heart
                        className={`mr-1.5 h-3.5 w-3.5 ${
                          isInWishlist ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      {isInWishlist ? "Wishlisted" : "Wishlist"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
