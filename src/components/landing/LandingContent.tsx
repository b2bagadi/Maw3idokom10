'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import BusinessCard from '@/components/search/BusinessCard';
import Footer from '@/components/layout/Footer'; // Footer is already client? Check. No, Footer.tsx might be server.
// If Footer uses useClientTranslation it must be client. Let's check Footer later. 

import { useClientTranslation } from '@/i18n/client';

interface LandingContentProps {
    newBusinesses: any[];
}

export default function LandingContent({ newBusinesses }: LandingContentProps) {
    const { t } = useClientTranslation();

    return (
        <>
            {/* Featured Section (Placeholder for now) */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">{t('landing.trending', { defaultValue: 'Trending Businesses' })}</h2>
                    <Link href="/search">
                        <Button variant="ghost">{t('landing.viewAll', { defaultValue: 'View All' })}</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border dark:border-gray-700 animate-pulse">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 w-3/4 rounded" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* New Businesses Section */}
            <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900/50 rounded-3xl my-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{t('landing.newTitle', { defaultValue: 'New on Maw3idokom' })}</h2>
                        <p className="text-gray-500">{t('landing.newSubtitle', { defaultValue: 'Discover the latest businesses joining our platform' })}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {newBusinesses.length > 0 ? (
                        newBusinesses.map((business) => (
                            <BusinessCard key={business.id} business={business} />
                        ))
                    ) : (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border dark:border-gray-700 h-64 flex flex-col items-center justify-center text-gray-400">
                                <span>{t('landing.noBusinesses', { defaultValue: 'No new businesses yet' })}</span>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-600 text-white py-20 px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.ctaTitle', { defaultValue: 'Grow Your Business with Maw3idokom' })}</h2>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                    {t('landing.ctaSubtitle', { defaultValue: 'Join thousands of businesses managing appointments, clients, and growth on our platform.' })}
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/business/register">
                        <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                            {t('landing.registerBusiness', { defaultValue: 'Register Business' })}
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white/10">
                            {t('landing.contactSales', { defaultValue: 'Contact Sales' })}
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    );
}
