'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { LangThemeToggle } from '@/components/ui/LangThemeToggle';
import { cn } from '@/lib/utils';
import {
    Building2, Calendar, Scissors, Users,
    CalendarCheck, Star, LogOut
} from 'lucide-react';

import ProfileEditor from '@/components/business/ProfileEditor';
import ScheduleGrid from '@/components/business/ScheduleGrid';
import EmergencyBlocks from '@/components/business/EmergencyBlocks';
import ServicesManager from '@/components/business/ServicesManager';
import StaffManager from '@/components/business/StaffManager';
import BookingsTable from '@/components/business/BookingsTable';
import ReviewsList from '@/components/business/ReviewsList';

import { useClientTranslation } from '@/i18n/client';

export default function BusinessDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('bookings');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const { t } = useClientTranslation();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        fetch('/api/settings/public')
            .then(res => res.json())
            .then(data => {
                if (data.system_logo_url) setLogoUrl(data.system_logo_url);
            })
            .catch(() => { });
    }, []);

    if (status === 'loading') return null;

    const tabs = [
        { id: 'bookings', label: t('business.bookings', { defaultValue: 'Bookings' }), icon: CalendarCheck },
        { id: 'profile', label: t('business.profile', { defaultValue: 'Profile' }), icon: Building2 },
        { id: 'schedule', label: t('business.schedule', { defaultValue: 'Schedule' }), icon: Calendar },
        { id: 'services', label: t('business.services', { defaultValue: 'Services' }), icon: Scissors },
        { id: 'staff', label: t('business.staff', { defaultValue: 'Staff' }), icon: Users },
        { id: 'reviews', label: t('business.reviews', { defaultValue: 'Reviews' }), icon: Star },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Maw3idokom Business" className="h-8 w-auto object-contain" />
                            ) : (
                                <div className="bg-primary-600 rounded-lg p-1.5">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <h1 className="text-xl font-bold text-primary-600">
                                {t('common.appName')} <span className="text-primary-400">{t('nav.business')}</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <LangThemeToggle />
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session?.user?.name}</p>
                                <p className="text-xs text-gray-500">{session?.user?.email}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                                <LogOut size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden sticky top-24">
                            <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hidden md:block">
                                <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider">{t('common.menu', { defaultValue: 'Menu' })}</h3>
                            </div>
                            <nav className="p-2 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                                activeTab === tab.id
                                                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 shadow-sm"
                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            )}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 min-h-[600px] border border-gray-100 dark:border-gray-700">
                            {activeTab === 'bookings' && <BookingsTable />}
                            {activeTab === 'profile' && <ProfileEditor />}
                            {activeTab === 'schedule' && (
                                <div className="space-y-8">
                                    <ScheduleGrid />
                                    <hr className="dark:border-gray-700" />
                                    <EmergencyBlocks />
                                </div>
                            )}
                            {activeTab === 'services' && <ServicesManager />}
                            {activeTab === 'staff' && <StaffManager />}
                            {activeTab === 'reviews' && <ReviewsList />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
