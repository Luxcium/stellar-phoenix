import { getSystemStats, SystemStats } from '@/app/actions/system';
import { useEffect, useState } from 'react';

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '< 1m';
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export default function SystemMonitor() {
  const [stats, setStats] = useState<SystemStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const data = await getSystemStats();
      setStats(data);
    }
    fetchStats();
  }, []);

  if (!stats) {
    return <SystemMonitorSkeleton />;
  }

  return (
    <div className="w-full bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-6">System Monitor</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              CPU
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Usage</span>
                <span className="text-sm font-medium">{stats.cpu.usage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cores</span>
                <span className="text-sm font-medium">{stats.cpu.cores}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Model</span>
                <span
                  className="text-sm font-medium truncate ml-4"
                  title={stats.cpu.model}
                >
                  {stats.cpu.model}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Memory
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total</span>
                <span className="text-sm font-medium">
                  {formatBytes(stats.memory.total)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Used</span>
                <span className="text-sm font-medium">
                  {formatBytes(stats.memory.used)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Free</span>
                <span className="text-sm font-medium">
                  {formatBytes(stats.memory.free)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              System
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Platform</span>
                <span className="text-sm font-medium">{stats.platform}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Hostname</span>
                <span className="text-sm font-medium">{stats.hostname}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">
                  {formatUptime(stats.uptime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SystemMonitorSkeleton() {
  return (
    <div className="w-full bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 p-4 sm:p-6">
      <div className="h-6 w-32 bg-muted rounded mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[1, 2].map((section) => (
            <div key={section}>
              <div className="h-4 w-24 bg-muted rounded mb-2"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div>
            <div className="h-4 w-24 bg-muted rounded mb-2"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
