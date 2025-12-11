'use client';

import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function StaffManager() {
    const [staff, setStaff] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const fetchStaff = async () => {
        try {
            const res = await fetch('/api/staff');
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setStaff(data);
        } catch {
            toast.error('Failed to load staff');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch('/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed');

            toast.success('Staff added');
            setIsModalOpen(false);
            reset();
            fetchStaff();
        } catch {
            toast.error('Failed to add staff');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete staff member?')) return;
        try {
            const res = await fetch(`/api/staff?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setStaff(prev => prev.filter(s => s.id !== id));
            toast.success('Deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Role', accessor: 'role' },
        {
            header: 'Actions',
            accessor: (s: any) => (
                <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>
                    <Trash2 size={16} />
                </Button>
            )
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Staff Members</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} className="mr-2" /> Add Staff
                </Button>
            </div>

            <Table data={staff} columns={columns} keyExtractor={s => s.id} isLoading={isLoading} emptyMessage="No staff found" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Name" {...register('name')} required />
                    <Input label="Role" {...register('role')} placeholder="e.g. Senior Stylist" required />
                    <Input label="Avatar URL" {...register('avatarUrl')} placeholder="https://..." />

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Staff</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
