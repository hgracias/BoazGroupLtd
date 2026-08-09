import { DriverTopbar } from "@/components/portal/driver-topbar";
import { SidebarContent, type SidebarDriver } from "@/components/portal/sidebar-content";

/**
 * Two-column application shell for the BOAZ360 driver portal.
 * `.portal-shell` swaps the design tokens to the dark palette for everything
 * rendered inside it (see globals.css).
 */
export function DriverPortalShell({
  driver,
  unreadMessages,
  todayLabel,
  children,
}: {
  driver: SidebarDriver;
  unreadMessages: number;
  todayLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="portal-shell min-h-screen bg-background text-foreground">
      <a
        href="#portal-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 border-r border-border/70 lg:block">
          <SidebarContent driver={driver} unreadMessages={unreadMessages} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <DriverTopbar
            driver={driver}
            unreadMessages={unreadMessages}
            todayLabel={todayLabel}
          />
          <main id="portal-main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
