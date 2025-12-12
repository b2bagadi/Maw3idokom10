'use client';

import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function SubscriptionsTable() {
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);

    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/subscriptions');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setPlans(data);
        } catch {
            toast.error('Failed to load plans');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const onSubmit = async (data: any) => {
        // features is comma separated string -> string (already)
        const formattedData = {
            ...data,
            features: data.features, // send as string
            pricePerMonth: parseInt(data.pricePerMonth),
            maxServices: parseInt(data.maxServices),
        };

        try {
            if (editingPlan) {
                // Update
                const res = await fetch('/api/admin/subscriptions', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingPlan.id, ...formattedData }),
                });
                if (!res.ok) throw new Error('Update failed');
                toast.success('Plan updated');
            } else {
                // Create
                const res = await fetch('/api/admin/subscriptions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedData),
                });
                if (!res.ok) throw new Error('Creation failed');
                toast.success('Plan created');
            }
            setIsModalOpen(false);
            reset();
            setEditingPlan(null);
            fetchPlans();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const startEdit = (plan: any) => {
        setEditingPlan(plan);
        setValue('name', plan.name);
        setValue('features', plan.features); // already string
        setValue('pricePerMonth', plan.pricePerMonth);
        setValue('maxServices', plan.maxServices);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this plan?')) return;
        try {
            const res = await fetch(`/api/admin/subscriptions?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            toast.success('Plan deleted');
            fetchPlans();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Price (cents)', accessor: 'pricePerMonth' },
        { header: 'Max Services', accessor: 'maxServices' },
        {
            header: 'Actions',
            accessor: (plan: any) => (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => startEdit(plan)}><Edit size={16} /></Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(plan.id)}><Trash2 size={16} /></Button>
                </div>
            )
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Subscription Plans</h2>
                <Button onClick={() => { setEditingPlan(null); reset(); setIsModalOpen(true); }}>
                    <Plus size={16} className="mr-2" /> Add Plan
                </Button>
            </div>

            <Table data={plans} columns={columns} keyExtractor={(p) => p.id} isLoading={isLoading} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPlan ? 'Edit Plan' : 'New Plan'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Name" {...register('name')} required />
                    <Input label="Price (cents/month)" type="number" {...register('pricePerMonth')} required />
                    <Input label="Max Services" type="number" {...register('maxServices')} required />
                    <Input label="Features (comma separated)" {...register('features')} placeholder="Feature 1, Feature 2" required />

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
