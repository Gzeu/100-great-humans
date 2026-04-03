import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '100 Great Humans',
  description: 'A curated library of 100 influential historical figures with agent-ready persona data.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
