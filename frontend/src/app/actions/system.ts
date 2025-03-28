'use server'

import os from 'node:os'

export interface SystemStats {
  cpu: {
    usage: number
    cores: number
    model: string
  }
  memory: {
    total: number
    used: number
    free: number
  }
  uptime: number
  platform: string
  hostname: string
}
// usage required but missing.
void formatBytes
 function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

 export   async function getSystemStats(): Promise<SystemStats> {
// Simulate a small delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 500))

  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  // Get CPU info
  const cpus = os.cpus()
  const cpuUsage = process.cpuUsage()
  const totalCPUUsage = (cpuUsage.user + cpuUsage.system) / (os.cpus().length * 1000000) // Convert to percentage

  return {
    cpu: {
      usage: parseFloat(totalCPUUsage.toFixed(2)),
      cores: cpus.length,
      model: cpus[0].model.trim()
    },
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem
    },
    uptime: os.uptime(),
    platform: os.platform(),
    hostname: os.hostname()
  }
}
