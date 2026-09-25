import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AUXUZ — Customer Acquisition & Automation',
  description: 'AUXUZ designs, builds and manages customer acquisition systems for modern businesses.',
  keywords: ['AUXUZ', 'customer acquisition', 'lead generation', 'automation', 'CRM', 'AI', 'conversion'],
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
