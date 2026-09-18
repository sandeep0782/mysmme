import Link from "next/link";

export default function SareeNotFound() {
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
