'use client';

import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AccountsTable() {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/accounts');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data.users || data);
        } catch (error) {
            toast.error('Failed to load accounts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = users;

        if (roleFilter !== 'all') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        if (statusFilter === 'active') {
            filtered = filtered.filter(u => u.isActive);
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter(u => !u.isActive);
        }

        setFilteredUsers(filtered);
    }, [roleFilter, statusFilter, users]);

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));

        try {
            const res = await fetch('/api/admin/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) throw new Error('Failed to update');
            toast.success('Status updated');
        } catch (error) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: currentStatus } : u));
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await fetch('/api/admin/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: deleteId }),
            });
            if (!res.ok) throw new Error('Failed to delete');

            setUsers(prev => prev.filter(u => u.id !== deleteId));
            toast.success('User deleted');
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setDeleteId(null);
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', accessor: 'role' },
        {
            header: 'Active',
            accessor: (user: any) => (
                <Switch
                    checked={user.isActive}
                    onChange={() => handleToggleActive(user.id, user.isActive)}
                    disabled={user.role === 'ADMIN'}
                />
            )
        },
        {
            header: 'Actions',
            accessor: (user: any) => (
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(user.id)}
                    disabled={user.role === 'ADMIN'}
                >
                    <Trash2 size={16} />
                </Button>
            )
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">User Accounts</h2>
                <div className="flex gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    >
                        <option value="all">All Roles</option>
                        <option value="CLIENT">Clients</option>
                        <option value="BUSINESS">Businesses</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <Table
                data={filteredUsers}
                columns={columns}
                keyExtractor={(item) => item.id}
                isLoading={isLoading}
            />

            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Confirm Deletion"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDelete}>Delete User</Button>
                    </>
                }
            >
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
            </Modal>
        </div>
    );
}