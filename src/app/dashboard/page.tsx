'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { LangThemeToggle } from '@/components/ui/LangThemeToggle';
import { cn } from '@/lib/utils';
import { User, CalendarCheck, LogOut } from 'lucide-react';

import ClientProfileEditor from '@/components/client/ProfileEditor';
import MyBookings from '@/components/client/MyBookings';
import { useClientTranslation } from '@/i18n/client';

export default function ClientDashboard() {
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
        { id: 'bookings', label: t('booking.myBookings', { defaultValue: 'My Bookings' }), icon: CalendarCheck },
        { id: 'profile', label: t('nav.profile', { defaultValue: 'Profile' }), icon: User },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Maw3idokom" className="h-8 w-auto object-contain" />
                            ) : (
                                <div className="bg-primary-600 rounded-lg p-1.5">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <h1 className="text-xl font-bold text-primary-600">{t('common.appName')}</h1>
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
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

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 min-h-[400px] border border-gray-100 dark:border-gray-700">
                            {activeTab === 'bookings' && <MyBookings />}
                            {activeTab === 'profile' && <ClientProfileEditor />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
