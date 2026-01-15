"use client";

import { Sidebar } from "./sidebar";
import { Suspense } from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
