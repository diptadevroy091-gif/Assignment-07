export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />

        <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex gap-5">
            <div className="h-20 w-20 animate-pulse rounded-3xl bg-slate-200" />

            <div className="flex-1">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-10 w-52 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-3xl bg-white"
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}