import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-white py-20">
      <div className="mx-auto w-full max-w-[1304px] px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-72 bg-stone-200" />
        <Skeleton className="mt-4 h-6 w-full max-w-xl bg-stone-200" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/5] rounded-lg bg-stone-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
