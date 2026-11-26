import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Equipment Desk",
  description: "Manage internal equipment reservations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">Equipment Desk</Link>
            <nav aria-label="Equipment desk">
              <Link href="/">Reservations</Link>
              <Link href="/activity">Activity</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
