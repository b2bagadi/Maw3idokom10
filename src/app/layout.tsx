import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: {
        default: 'Maw3idokom - Book Your Appointment Today',
        template: '%s | Maw3idokom',
    },
    description: 'Find and book local services in seconds. Maw3idokom is your one-stop platform for appointments.',
    keywords: ['appointments', 'booking', 'services', 'local business', 'scheduling'],
    authors: [{ name: 'Maw3idokom Team' }],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://maw3idokom.com',
        siteName: 'Maw3idokom',
        title: 'Maw3idokom - Book Your Appointment Today',
        description: 'Find and book local services in seconds',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Maw3idokom - Book Your Appointment Today',
        description: 'Find and book local services in seconds',
    },
    robots: {
        index: true,
        follow: true,
    },
};

import { FloatingBg } from '@/components/ui/FloatingBg';
import Header from '@/components/layout/Header';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.variable}>
                <Providers>
                    <FloatingBg />
                    <Header />
                    <main className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 relative z-10 transition-colors duration-300">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
