import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

const Cta = () => {
  return (
    <section
      aria-labelledby="saree-cta-heading"
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-red-700
        via-red-600
        to-rose-700
        px-6
        py-16
        text-white
        sm:py-20
        lg:py-24
      "
    >
      {/* =========================================================
          BACKGROUND IMAGE
      ========================================================= */}

      <div className="absolute inset-0">
        <Image
          src="/images/cta-saree.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />

        <div className="absolute inset-0 bg-red-700/75" />
      </div>

      {/* =========================================================
          DECORATIVE ELEMENTS
      ========================================================= */}

      <div
        aria-hidden="true"
        className="
          absolute
          -left-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-red-400/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          -bottom-24
          -right-24
          h-72
          w-72
          rounded-full
          bg-rose-300/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          right-10
          top-10
          hidden
          h-32
          w-32
          rounded-full
          border
          border-white/10
          md:block
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-10
          left-10
          hidden
          h-20
          w-20
          rounded-full
          border
          border-white/10
          md:block
        "
      />

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Heart
          aria-hidden="true"
          className="mx-auto h-10 w-10 fill-white text-white"
        />

        <p
          className="
            mt-6
            text-xs
            font-semibold
            uppercase
            tracking-[0.3em]
            text-red-100
            sm:text-sm
          "
        >
          Your Style. Your Saree.
        </p>

        <h2
          id="saree-cta-heading"
          className="
            mt-4
            text-3xl
            font-bold
            tracking-tight
            sm:text-4xl
            md:text-5xl
          "
        >
          Find a Saree That Feels Like You
        </h2>

        <p
          className="
            mx-auto
            mt-5
            max-w-2xl
            text-base
            leading-7
            text-red-50
            md:text-lg
          "
        >
          Explore timeless weaves, vibrant colors and elegant designs for
          celebrations, special occasions and everyday style.
        </p>

        <Link
          href="/sarees"
          className="
            group
            mt-8
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            bg-white
            px-8
            py-3.5
            font-semibold
            text-red-600
            shadow-lg
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-red-50
            hover:shadow-xl
            focus:outline-none
            focus:ring-2
            focus:ring-white
            focus:ring-offset-2
            focus:ring-offset-red-600
          "
        >
          Explore All Sarees
          <ArrowRight
            aria-hidden="true"
            className="
              h-5
              w-5
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </Link>
      </div>
    </section>
  );
};

export default Cta;
