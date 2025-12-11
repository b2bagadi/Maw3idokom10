'use client';

import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatPrice, formatTime } from '@/lib/utils';

export default function ServicesManager() {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setServices(data);
        } catch {
            toast.error('Failed to load services');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed');

            toast.success('Service added');
            setIsModalOpen(false);
            reset();
            fetchServices();
        } catch {
            toast.error('Failed to add service');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete service?')) return;
        try {
            const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            setServices(prev => prev.filter(s => s.id !== id));
            toast.success('Deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Duration', accessor: (s: any) => `${s.duration} min` },
        { header: 'Price', accessor: (s: any) => formatPrice(s.price) },
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
                <h2 className="text-xl font-bold">Services</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} className="mr-2" /> Add Service
                </Button>
            </div>

            <Table data={services} columns={columns} keyExtractor={s => s.id} isLoading={isLoading} emptyMessage="No services found" />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Service">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Service Name" {...register('name')} required />
                    <Input label="Description" {...register('description')} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Price (cents)" type="number" {...register('price')} required />
                        <Input label="Duration (min)" type="number" {...register('duration')} required />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Service</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
