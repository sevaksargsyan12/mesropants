import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="hy">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#3b0334] text-[#fcc207]">
        <p className="font-semibold uppercase tracking-widest text-[#fcc207]">404</p>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link href="/hy" className="text-sm underline">
          Go home
        </Link>
      </body>
    </html>
  );
}
