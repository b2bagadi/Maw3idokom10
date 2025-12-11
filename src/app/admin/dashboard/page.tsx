'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import AccountsTable from '@/components/admin/AccountsTable';
import SubscriptionsTable from '@/components/admin/SubscriptionsTable';
import GlobalSettings from '@/components/admin/GlobalSettings';
import CategoriesManager from '@/components/admin/CategoriesManager';
import MessagesManager from '@/components/admin/MessagesManager';
import AdminProfile from '@/components/admin/AdminProfile';
import { LangThemeToggle } from '@/components/ui/LangThemeToggle';
import { cn } from '@/lib/utils';
import { Users, CreditCard, Settings, LayoutDashboard, Database, MessageSquare, UserCog } from 'lucide-react';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('accounts');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router]);

    if (status === 'loading') return null;

    const tabs = [
        { id: 'accounts', label: 'Accounts', icon: Users },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'categories', label: 'Categories', icon: LayoutDashboard },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'profile', label: 'Account', icon: UserCog },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* ... Navbar (omitted for brevity in edit, keeping existing) ... */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                             <LayoutDashboard className="text-primary-600" />
                            <h1 className="text-xl font-bold">Admin Portal</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <LangThemeToggle />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {session?.user?.name}
                            </span>
                             <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                            activeTab === tab.id
                                                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        )}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 min-h-[600px]">
                        {activeTab === 'accounts' && <AccountsTable />}
                        {activeTab === 'subscriptions' && <SubscriptionsTable />}
                        {activeTab === 'messages' && <MessagesManager />}
                        {activeTab === 'settings' && <GlobalSettings />}
                        {activeTab === 'categories' && <CategoriesManager />}
                        {activeTab === 'profile' && <AdminProfile />}
                    </main>
                </div>
            </div>
        </div>
    );
}
