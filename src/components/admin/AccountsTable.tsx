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
    const [isLoading, setIsLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/accounts');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load accounts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        // Optimistic update
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
            // Revert
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
            <h2 className="text-xl font-bold mb-4">User Accounts</h2>
            <Table
                data={users}
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
