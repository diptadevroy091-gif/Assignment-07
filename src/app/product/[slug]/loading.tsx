export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="h-120 animate-pulse rounded-3xl bg-white" />

          <div className="rounded-3xl bg-white p-8">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

            <div className="mt-5 h-14 w-3/4 animate-pulse rounded bg-slate-200" />

            <div className="mt-6 h-24 w-full animate-pulse rounded bg-slate-200" />

            <div className="mt-6 h-32 w-full animate-pulse rounded-3xl bg-slate-100" />
          </div>
        </div>
      </div>
    </main>
  );
}