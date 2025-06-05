export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-8 animate-pulse">
        <div className="mb-4 h-8 w-48 rounded bg-gray-200" />
        <div className="space-y-4 rounded-lg bg-white p-4 shadow">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
          <div className="h-10 w-full rounded bg-gray-200" />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="animate-pulse">
          <div className="bg-gray-50 px-6 py-3">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
          </div>
          <div className="divide-y divide-gray-200 bg-white">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-4 w-48 rounded bg-gray-200" />
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-4 w-16 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
