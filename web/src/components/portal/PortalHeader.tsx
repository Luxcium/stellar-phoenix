import Image from 'next/image';

export default function PortalHeader() {
  return (
    <header className="w-full bg-background border-b border-border/40 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Image
            src="/next.svg"
            alt="Portal Logo"
            width={120}
            height={29}
            style={{ width: 'auto', height: 'auto' }}
            className="dark:invert"
            priority
          />
          <span className="text-sm font-medium hidden sm:inline-block">
            Local Portal
          </span>
        </div>
        <nav className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Status: <span className="text-green-500">Connected</span>
          </span>
        </nav>
      </div>
    </header>
  );
}
