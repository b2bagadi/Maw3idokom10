'use client';

import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatDate } from '@/lib/utils';

export default function EmergencyBlocks() {
    const [blocks, setBlocks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm();

    const fetchBlocks = async () => {
        try {
            const res = await fetch('/api/emergency-blocks');
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setBlocks(data);
        } catch {
            toast.error('Failed to load blocks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch('/api/emergency-blocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed');

            toast.success('Block created');
            reset();
            fetchBlocks();
        } catch {
            toast.error('Failed to create block');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this block?')) return;
        try {
            const res = await fetch(`/api/emergency-blocks?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setBlocks(prev => prev.filter(b => b.id !== id));
            toast.success('Removed');
        } catch {
            toast.error('Failed to remove');
        }
    };

    const columns = [
        { header: 'Start Date', accessor: (b: any) => formatDate(b.startDate) },
        { header: 'End Date', accessor: (b: any) => formatDate(b.endDate) },
        { header: 'Reason', accessor: 'reason' },
        {
            header: 'Actions',
            accessor: (b: any) => (
                <Button variant="danger" size="sm" onClick={() => handleDelete(b.id)}>
                    <Trash2 size={16} />
                </Button>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Add Time Block</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-end">
                    <Input label="Start Date" type="date" {...register('startDate')} required containerClassName="flex-1" />
                    <Input label="End Date" type="date" {...register('endDate')} required containerClassName="flex-1" />
                    <Input label="Reason" {...register('reason')} placeholder="e.g. Holiday" required containerClassName="flex-[2]" />
                    <Button type="submit" className="mb-[2px]">Block Time</Button>
                </form>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Current Blocks</h3>
                <Table data={blocks} columns={columns} keyExtractor={b => b.id} isLoading={isLoading} emptyMessage="No time blocks set" />
            </div>
        </div>
    );
}
