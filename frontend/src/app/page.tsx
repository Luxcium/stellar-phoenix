// <<<<<<< HEAD
// import { Suspense } from "react"
// import PortalHeader from "@/components/portal/PortalHeader"
// import PortalFooter from "@/components/portal/PortalFooter"
// import PortalStatus, { PortalStatusFallback } from "@/components/portal/PortalStatus"
// import SystemMonitorButton from "@/components/portal/interactive/SystemMonitorButton"
// import PortalButton from "@/components/portal/interactive/PortalButton"

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col bg-background text-foreground">
//       <PortalHeader />

//       <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto space-y-8">
//           <section className="space-y-4">
//             <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
//               Local Computer Portal
//             </h1>
//             <p className="text-muted-foreground">
//               Access and manage your local computer resources securely through this portal.
//             </p>
//           </section>

//           <section className="space-y-6">
//             <h2 className="text-xl font-semibold tracking-tight">System Status</h2>
//             <Suspense fallback={<PortalStatusFallback />}>
//               <PortalStatus />
//             </Suspense>
//           </section>

//           <section className="space-y-6">
//             <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="p-4 rounded-lg border border-border/40 space-y-4">
//                 <h3 className="font-medium">File Management</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Access and manage your local files securely.
//                 </p>
//                 <PortalButton variant="outline">
//                   Open File Manager
//                 </PortalButton>
//               </div>
//               <div className="p-4 rounded-lg border border-border/40 space-y-4">
//                 <h3 className="font-medium">System Monitor</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Monitor system resources and performance.
//                 </p>
//                 <SystemMonitorButton />
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       <PortalFooter />
//     </div>
//   )
// =======
import ImageGallery from '@/components/ImageGallery';
import ImageUploadZone from '@/components/ImageUploadZone';
import PageHeader from '@/components/PageHeader';
import SearchFilters from '@/components/SearchFilters';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <PageHeader
        title="Image Management System"
        description="Upload, organize, and manage your images efficiently"
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 mt-8">
        {/* Sidebar with filters */}
        <aside className="md:col-span-3">
          <div className="card sticky top-8">
            <SearchFilters />
          </div>
        </aside>

        {/* Main content area */}
        <div className="md:col-span-9">
          <section className="mb-8">
            <ImageUploadZone />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Image Gallery</h2>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              }
            >
              <ImageGallery />
            </Suspense>
          </section>
        </div>
      </div>

      {/* Processing queue status indicator */}
      <div className="fixed bottom-4 right-4">
        <div className="card bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium">Processing Queue</h3>
            <div className="flex items-center mt-1">
              <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                <div className="progress-bar width-60" />
              </div>
              <span className="ml-2 text-xs text-gray-500">3 items</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
  // >>>>>>> main
}
