import Hero from '@/components/landing/Hero';
import Categories from '@/components/landing/Categories';
import LandingContent from '@/components/landing/LandingContent'; // New import
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'Maw3idokom - Book Appointments Online',
    description: 'Find and book top-rated professionals nearby: Salons, Mechanics, Doctors, and more.',
    openGraph: {
        title: 'Maw3idokom - Book Appointments Online',
        description: 'Find and book top-rated professionals nearby.',
        type: 'website',
    }
};

async function getNewBusinesses() {
    try {
        const businesses = await prisma.business.findMany({
            take: 4,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                reviews: true
            }
        });
        return businesses;
    } catch (error) {
        return [];
    }
}

export default async function Home() {
    const newBusinesses = await getNewBusinesses();

    return (
        <div className="min-h-screen">
            <Hero />
            <Categories />
            <LandingContent newBusinesses={newBusinesses} />
            <Footer />
        </div>
    );
}
