import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Northstar | Enterprise AI Workspace', description: 'Enterprise knowledge and workflow assistant' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
