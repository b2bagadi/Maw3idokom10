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
import AdminChat from '@/components/admin/AdminChat';
import AdminProfile from '@/components/admin/AdminProfile';
import AdminBookingsTable from '@/components/admin/AdminBookingsTable';
import { LangThemeToggle } from '@/components/ui/LangThemeToggle';
import { Users, CreditCard, Settings, LayoutDashboard, MessageSquare, UserCog, Mail, CalendarCheck } from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

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
        { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'chats', label: 'Chats', icon: MessageSquare },
        { id: 'messages', label: 'Contact', icon: Mail },
        { id: 'categories', label: 'Categories', icon: LayoutDashboard },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'profile', label: 'Account', icon: UserCog },
    ];

    return (
        <DashboardShell
            title="Admin Portal"
            subtitle="Dashboard"
            icon={LayoutDashboard}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userName={session?.user?.name}
            userEmail={session?.user?.email}
            rightSlot={
                <>
                    <LangThemeToggle />
                    <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                        Logout
                    </Button>
                </>
            }
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 min-h-[600px]">
                {activeTab === 'accounts' && <AccountsTable />}
                {activeTab === 'bookings' && <AdminBookingsTable />}
                {activeTab === 'subscriptions' && <SubscriptionsTable />}
                {activeTab === 'chats' && <AdminChat />}
                {activeTab === 'messages' && <MessagesManager />}
                {activeTab === 'settings' && <GlobalSettings />}
                {activeTab === 'categories' && <CategoriesManager />}
                {activeTab === 'profile' && <AdminProfile />}
            </div>
        </DashboardShell>
    );
}