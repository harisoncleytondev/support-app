import type { ReactNode } from "react";

interface AppLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

function AppLayout({ sidebar, header, children }: AppLayoutProps) {
  return (
    <div className="bg-[#F3F4F6] text-[#1F2937] font-sans text-sm flex h-screen overflow-hidden antialiased">
      {sidebar}

      <main className="flex-1 flex flex-col min-w-0">
        {header}
        <div className="flex-1 relative overflow-hidden">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;
