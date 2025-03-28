async function getPortalStatus() {
  // Simulated async server-side data fetch
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    status: 'online',
    lastSync: new Date().toISOString(),
    connections: 1,
    latency: '12ms',
  };
}

export default async function PortalStatus() {
  const status = await getPortalStatus();

  return (
    <div className="w-full bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">Portal Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {status.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Sync</span>
            <span className="text-sm font-medium">
              {new Date(status.lastSync).toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Connections</span>
            <span className="text-sm font-medium">{status.connections}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Latency</span>
            <span className="text-sm font-medium">{status.latency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortalStatusFallback() {
  return (
    <div className="w-full bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 p-4 sm:p-6 animate-pulse">
      <div className="h-6 w-32 bg-muted rounded mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded"></div>
          <div className="h-5 bg-muted rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded"></div>
          <div className="h-5 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}
