import Image from 'next/image';

export default function PortalFooter() {
  return (
    <footer className="w-full bg-background border-t border-border/40 px-4 py-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Local Portal
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Image
              src="/globe.svg"
              alt="GitHub"
              width={16}
              height={16}
              style={{ width: 'auto', height: 'auto' }}
              className="opacity-70"
            />
            Documentation
          </a>
          <a
            href="/status"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <Image
              src="/window.svg"
              alt="Status"
              width={16}
              height={16}
              style={{ width: 'auto', height: 'auto' }}
              className="opacity-70"
            />
            Status
          </a>
        </div>
      </div>
    </footer>
  );
}
