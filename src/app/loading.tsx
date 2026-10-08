export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-80 animate-pulse rounded-4xl bg-slate-200" />

        <div className="mt-12">
          <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </main>
  );
}