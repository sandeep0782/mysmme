"use client";

import { useGetProductBySlugQuery } from "@/store/api/productApi";
import {
  Heart,
  Loader2,
  Share2,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { SareeProduct } from "@/types/product";
import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
} from "@/store/api/cartApi";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api/wishlistApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart } from "@/store/slice/cartSlice";
import toast from "react-hot-toast";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/store/slice/wishlistSlice";
const SareeDetailsPage = () => {
  const [pinCode, setPinCode] = useState("");
  const [pinError, setPinError] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [isSharing, setIsSharing] = useState(false);

  const {
    data: productResponse,
    isLoading,
    isError,
  } = useGetProductBySlugQuery(slug as string, {
    skip: !slug,
  });
  const [addToCartMutation] = useAddToCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.items);

  const dispatch = useDispatch();
  const saree = productResponse?.data as SareeProduct | undefined;

  const getDisplayName = (value: unknown): string => {
    if (typeof value === "string") return value;

    if (
      value &&
      typeof value === "object" &&
      "name" in value &&
      typeof value.name === "string"
    ) {
      return value.name;
    }

    return "";
  };
  if (!saree) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Saree not found</h1>

          <Link
            href="/sarees"
            className="mt-4 inline-block text-red-500 hover:underline"
          >
            Back to Sarees
          </Link>
        </div>
      </div>
    );
  }

  const discount =
    saree.price > saree.finalPrice
      ? Math.round(((saree.price - saree.finalPrice) / saree.price) * 100)
      : 0;

  const relatedColors: any[] = [];

  const handleCheckPin = async () => {
    setPinError("");
    setDeliveryMessage("");

    if (pinCode.length !== 6) {
      setPinError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsCheckingPin(true);

    // Simulate checking delivery availability
    await new Promise((resolve) => setTimeout(resolve, 700));

    setIsCheckingPin(false);

    setDeliveryMessage(
      "Delivery available. Estimated delivery in 3–5 business days.",
    );
  };

  const handleAddToCart = async () => {
    if (saree) {
      setIsAddToCart(true);
      try {
        const result = await addToCartMutation({
          productId: saree?._id,
          quantity: 1,
        }).unwrap();

        if (result.success && result.data) {
          dispatch(addToCart(result.data));
          toast.success(result.message || "Add to Cart successfully");
        } else {
          throw new Error(result.message || "Failed to add to cart");
        }
      } catch (error: any) {
        const errormessage = error?.data?.message;
        const status = error?.status;
        if (status === 401) {
          dispatch(toggleLoginDialog());
          return;
        }
        toast.error(errormessage);
      } finally {
        setIsAddToCart(false);
      }
    }
  };
  const isInWishlist = wishlist.some((item) =>
    item.products.includes(saree._id),
  );

  const handleAddToWishlist = async (productId: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId),
      );
      if (isWishlist) {
        const result = await removeWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishlistAction(productId));
          toast.success(result.message || "Removed from Wishlist");
        } else {
          throw new Error(result.error || "Failed to Remove from wishlist");
        }
      } else {
        const result = await addToWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(addToWishlistAction(result.data));
          toast.success(result.message || "Added to wishlist successfully");
        } else {
          throw new Error(result.message || "failed to add to wishlist");
        }
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      const status = error?.status;
      if (status === 401) {
        dispatch(toggleLoginDialog());
        return;
      }
      toast.error(errormessage);
    }
  };
  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);

    const productUrl = window.location.href;

    const shareData = {
      title: saree.title,
      text: `Check out this saree: ${saree.title}`,
      url: productUrl,
    };

    try {
      /*
       * Native share
       */
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }

      /*
       * WhatsApp fallback
       */
      const whatsappMessage = `Check out this saree: ${saree.title}\n\n${productUrl}`;

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
        whatsappMessage,
      )}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      return;
    } catch (error: any) {
      /*
       * User cancelled native share
       */
      if (error?.name === "AbortError") {
        return;
      }

      /*
       * Clipboard fallback
       */
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(productUrl);

          toast.success("Product link copied!");
          return;
        }
      } catch {
        // Ignore clipboard failure
      }

      toast.error("Unable to share product");
    } finally {
      setIsSharing(false);
    }
  };

  const isInCart = cart.some(
    (item) => String(item.product) === String(saree._id),
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 lg:px-8">
        {/* =========================
                    BREADCRUMB
                ========================= */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-black hover:underline">
            Home
          </Link>

          <span>/</span>

          <Link href="/sarees" className="hover:text-black hover:underline">
            Sarees
          </Link>

          <span>/</span>

          <span className="line-clamp-1 text-gray-700">{saree.title}</span>
        </nav>

        {/* =========================
                    MAIN PRODUCT AREA
                ========================= */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.9fr)]">
          {/* =========================
                        IMAGE GALLERY
                    ========================= */}
          <section>
            <h2 className="sr-only">{saree.title} images</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {saree.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative overflow-hidden bg-gray-50"
                >
                  <Image
                    src={image}
                    alt={`${saree.title} - ${saree.color?.name} saree image ${index + 1}`}
                    width={900}
                    height={1200}
                    priority={index < 2}
                    className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    sizes="
                                            (max-width: 768px) 50vw,
                                            (max-width: 1200px) 45vw,
                                            40vw
                                        "
                  />

                  {/* Discount */}
                  {index === 0 && discount > 0 && (
                    <span className="absolute left-0 top-3 bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* =========================
                        PRODUCT INFORMATION
                    ========================= */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-2">
              {/* Brand + Color */}
              <div className="flex items-center justify-between">
                <Link
                  href={`/sarees?brand=${encodeURIComponent(saree.brand.slug ?? "")}`}
                  className="text-lg font-bold text-red-500 hover:underline uppercase"
                >
                  {saree.brand?.name ?? ""}
                </Link>
              </div>
              {/* Title */}
              <div>
                <h1 className="leading-tight font-semibold text-zinc-500 md:text-xl">
                  {saree.title}
                </h1>
              </div>
              {/* Price */}
              <div className="border-b pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{saree.finalPrice}
                  </span>
                  {saree.price > saree.finalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{saree.price}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-sm font-semibold text-red-600">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-green-600">
                  Inclusive of all applicable taxes
                </p>
              </div>
              {/* Description */}
              <div>
                <h2 className="mb-2 text-lg font-semibold">Description</h2>

                <p className="text-sm leading-6 text-gray-600">
                  {saree.description}
                </p>
              </div>
              {/* =========================
                                    MORE COLORS
                                ========================= */}
              {relatedColors.length > 0 && (
                <div className="border-t pt-2">
                  <h2 className="mb-2 text-lg font-semibold">More Colors</h2>

                  <div className="flex flex-wrap gap-2">
                    {relatedColors.map((item) => (
                      <Link
                        key={item._id}
                        href={`/sarees/${item._id}`}
                        className="group w-20"
                      >
                        <div className="overflow-hidden rounded-md border bg-gray-50 group-hover:border-red-500">
                          <Image
                            src={item.images[0]}
                            alt={`${item.title} - ${item.color?.name}`}
                            width={160}
                            height={200}
                            className="aspect-[4/5] w-full object-cover"
                          />
                        </div>

                        <p className="mt-1 text-center text-sm font-medium text-gray-700 group-hover:text-red-500">
                          {item.color?.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {/* =========================
                            BUY + WISHLIST BUTTONS
                            ========================= */}
              <div className="grid grid-cols-2 gap-3">
                {/* Buy Now */}
                <button
                  type="button"
                  onClick={() => {
                    if (isInCart) {
                      router.push("/checkout/cart");
                      return;
                    }

                    handleAddToCart();
                  }}
                  disabled={isAddToCart}
                  className="flex w-full items-center justify-center rounded-sm bg-red-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                >
                  {isAddToCart ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : isInCart ? (
                    <>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Go to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Buy Now
                    </>
                  )}
                </button>
                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => handleAddToWishlist(saree._id)}
                  className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border px-6 py-4 text-sm font-semibold transition-colors ${
                    isInWishlist
                      ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                      : "border-red-500 bg-white text-red-500 hover:bg-red-50"
                  }`}
                >
                  <Heart
                    className="h-5 w-5"
                    fill={isInWishlist ? "currentColor" : "none"}
                  />
                  {isInWishlist ? "Wishlisted" : "Wishlist"}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-red-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSharing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Share2 className="h-5 w-5" />
                  )}
                  Share Product
                </button>
              </div>
              {/* Delivery Options */}
              <div className="mt-6 border-t pt-4">
                <h2 className="mb-5 text-lg font-semibold">Delivery Options</h2>

                {/* Pincode */}
                <div className="max-w-md">
                  <div className="flex items-center overflow-hidden rounded-md border border-gray-300 focus-within:border-red-500">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setPinCode(value);
                        setPinError("");
                        setDeliveryMessage("");
                      }}
                      placeholder="Enter PIN code"
                      className="h-11 flex-1 px-3 text-sm outline-none placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={handleCheckPin}
                      disabled={isCheckingPin || pinCode.length !== 6}
                      className="h-11 px-5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCheckingPin ? "Checking..." : "Check"}
                    </button>
                  </div>

                  {/* Error */}
                  {pinError && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {pinError}
                    </p>
                  )}

                  {/* Success */}
                  {deliveryMessage && (
                    <p className="mt-2 text-xs font-medium text-green-600">
                      ✓ {deliveryMessage}
                    </p>
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Please enter PIN code to check delivery time & Pay on Delivery
                  Availability
                </p>

                {/* Delivery Benefits */}
                <div className="mt-6 ">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        100% Original Products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                      ✓
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        Pay on Delivery
                      </p>

                      <div className="group relative">
                        <button
                          type="button"
                          aria-label="Prepaid discount information"
                          className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-gray-400 text-[10px] font-semibold text-gray-500 hover:border-red-500 hover:text-red-500"
                        >
                          i
                        </button>

                        {/* Instant tooltip */}
                        <div className="pointer-events-none absolute bottom-6 left-1/2 z-50 hidden w-64 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-xs font-normal leading-5 text-white shadow-lg group-hover:block">
                          Get more discount by making your order prepaid.
                          <span className="mt-1 block font-semibold text-green-300">
                            Pay online and save more!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Easy 7 Days Returns & Exchanges
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* PRODUCT DETAILS */}
              <div className="border-t pt-6">
                <h2 className="mb-5 text-lg font-semibold">Product Details</h2>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium text-gray-900">
                    {saree.brand?.name || "-"}
                  </span>

                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">
                    {saree.type || "-"}
                  </span>

                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">
                    {saree.category?.name || "-"}
                  </span>

                  <span className="text-gray-500">Fabric</span>
                  <span className="font-medium text-gray-900">
                    {saree.sareeFabric || "-"}
                  </span>

                  <span className="text-gray-500">Color</span>
                  <span className="font-medium text-gray-900">
                    {saree.color?.name || "-"}
                  </span>

                  <span className="text-gray-500">Pattern</span>
                  <span className="font-medium text-gray-900">
                    {saree.pattern || "-"}
                  </span>

                  <span className="text-gray-500">Print / Pattern Type</span>
                  <span className="font-medium text-gray-900">
                    {saree.printOrPatternType || "-"}
                  </span>

                  <span className="text-gray-500">Border</span>
                  <span className="font-medium text-gray-900">
                    {saree.border || "-"}
                  </span>

                  <span className="text-gray-500">Loom Type</span>
                  <span className="font-medium text-gray-900">
                    {saree.loomType || "-"}
                  </span>

                  <span className="text-gray-500">Occasion</span>
                  <span className="font-medium text-gray-900">
                    {saree.occasion || "-"}
                  </span>

                  <span className="text-gray-500">Ornamentation</span>
                  <span className="font-medium text-gray-900">
                    {saree.ornamentation || "-"}
                  </span>

                  <span className="text-gray-500">Pallu Details</span>
                  <span className="font-medium text-gray-900">
                    {saree.palluDetails || "-"}
                  </span>

                  <span className="text-gray-500">Blouse</span>
                  <span className="font-medium text-gray-900">
                    {saree.blouse || "-"}
                  </span>

                  <span className="text-gray-500">Blouse Color</span>
                  <span className="font-medium text-gray-900">
                    {saree.blouseColor || "-"}
                  </span>

                  <span className="text-gray-500">Blouse Fabric</span>
                  <span className="font-medium text-gray-900">
                    {saree.blouseFabric || "-"}
                  </span>

                  <span className="text-gray-500">Blouse Pattern</span>
                  <span className="font-medium text-gray-900">
                    {saree.blousePattern || "-"}
                  </span>

                  <span className="text-gray-500">Blouse Length</span>
                  <span className="font-medium text-gray-900">
                    {saree.blouseLengthSize
                      ? `${saree.blouseLengthSize} m`
                      : "-"}
                  </span>

                  <span className="text-gray-500">Saree Length</span>
                  <span className="font-medium text-gray-900">
                    {saree.sareeLengthSize ? `${saree.sareeLengthSize} m` : "-"}
                  </span>

                  <span className="text-gray-500">Transparency</span>
                  <span className="font-medium text-gray-900">
                    {saree.transparency || "-"}
                  </span>

                  <span className="text-gray-500">Net Weight</span>
                  <span className="font-medium text-gray-900">
                    {saree.netWeight ? `${saree.netWeight} g` : "-"}
                  </span>

                  <span className="text-gray-500">Country of Origin</span>
                  <span className="font-medium text-gray-900">
                    {saree.countryOfOrigin || "-"}
                  </span>

                  <span className="text-gray-500">Season</span>
                  <span className="font-medium text-gray-900">
                    {saree.season?.name || "-"}
                  </span>

                  <span className="text-gray-500">Collection</span>
                  <span className="font-medium text-gray-900">
                    {saree.collectionName || "-"}
                  </span>
                </div>
              </div>
              {/* =========================
                                SHIPPING
                            ========================= */}
              <div className="border-y py-5">
                <h2 className="font-semibold">Shipping</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Shipping charge: ₹{saree.shippingCharge}
                </p>
              </div>
              {/* =========================
                                PRODUCT & SUPPLIER INFO
                            ========================= */}
              <div className="mt-4">
                <div className="space-y-1 text-sm">
                  {/* Product Code */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Product Code</span>

                    <span className="font-semibold text-gray-900">
                      44376764
                    </span>
                  </div>

                  {/* Seller */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Seller</span>

                    <span className="font-semibold uppercase text-gray-900">
                      {saree.seller || saree.brand?.name || "-"}
                    </span>
                  </div>

                  {/* Supplier Information */}
                  <button
                    type="button"
                    onClick={() => setIsSupplierModalOpen(true)}
                    className="text-sm font-semibold text-red-500 transition-colors hover:text-red-600 hover:underline cursor-pointer"
                  >
                    View Supplier Information
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* =========================
                    MORE FROM BRAND
                ========================= */}
        <section className="mt-16 border-t pt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                More Sarees by {saree.brand?.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Explore more sarees from {saree.brand?.name}
              </p>
            </div>

            <Link
              href={`/sarees?brand=${encodeURIComponent(saree.brand.slug ?? "")}`}
              className="shrink-0 text-sm font-semibold text-red-500 hover:underline"
            >
              Search more by brand →
            </Link>
          </div>
        </section>
      </div>

      {/* =========================
                SUPPLIER INFORMATION
            ========================= */}
      {isSupplierModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setIsSupplierModalOpen(false)}
        >
          <div
            className="w-full max-w-sm select-none rounded-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">
                Supplier Information
              </h2>

              <button
                type="button"
                onClick={() => setIsSupplierModalOpen(false)}
                className="text-xl leading-none text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {/* Details */}
            <div className="space-y-5 px-5 py-5">
              {/* Supplier */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                  Supplier Details
                </p>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {saree.manufacturerName || "-"}
                  </p>

                  <p className="text-xs leading-5 text-gray-500">
                    {saree.manufacturerAddress || "-"}
                  </p>
                </div>
              </div>

              {/* Packer */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                  Packer Details
                </p>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {saree.packerName || "-"}
                  </p>

                  <p className="text-xs leading-5 text-gray-500">
                    {saree.packerAddress || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Close */}
            <div className="border-t px-5 py-3">
              <button
                type="button"
                onClick={() => setIsSupplierModalOpen(false)}
                className="w-full rounded-sm bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SareeDetailsPage;
