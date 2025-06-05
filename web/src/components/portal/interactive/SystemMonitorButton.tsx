'use client';

import { Suspense, useState } from 'react';
import SystemMonitor, { SystemMonitorSkeleton } from '../SystemMonitor';
import PortalButton from './PortalButton';

export default function SystemMonitorButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <PortalButton
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {isOpen ? 'Hide System Stats' : 'View System Stats'}
      </PortalButton>

      {isOpen && (
        <Suspense fallback={<SystemMonitorSkeleton />}>
          <SystemMonitor />
        </Suspense>
      )}
    </div>
  );
}
