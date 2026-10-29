import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from '../components/ClientShell';

export const metadata: Metadata = {
  title: 'Contentflow — Content Manager for Social Media | By Divyanshu',
  description:
    'A high-performance, minimalist content management and scheduling SaaS dashboard powered by Java 21 Spring Boot and Next.js 14 App Router. Made by Divyanshu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-rose-100 selection:text-primary">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
