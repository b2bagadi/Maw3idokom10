'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MapPicker from '@/components/ui/MapPicker';

const CATEGORY_OPTIONS = [
    { value: 'Beauty & Spa', label: 'Beauty & Spa' },
    { value: 'Hair Salon', label: 'Hair Salon' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Automotive', label: 'Automotive' },
    { value: 'Home Services', label: 'Home Services' },
    { value: 'Restaurant', label: 'Restaurant' },
    { value: 'Education', label: 'Education' },
];

export default function ProfileEditor() {
    const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit, control, setValue, watch, reset } = useForm();

    const lat = watch('lat');
    const lng = watch('lng');

    useEffect(() => {
        fetch('/api/businesses')
            .then(res => res.json())
            .then(data => {
                // Map gallery objects to array of strings for the form
                const galleryUrls = data.gallery?.map((img: any) => img.url) || [];
                reset({ ...data, gallery: galleryUrls });
                setIsLoading(false);
            })
            .catch(() => toast.error('Failed to load profile'));
    }, [reset]);

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch('/api/businesses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed');
            toast.success('Profile updated');
        } catch {
            toast.error('Failed to update profile');
        }
    };

    if (isLoading) return <div className="h-40 bg-gray-100 animate-pulse rounded-lg" />;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Business Name" {...register('name')} required />
                <Input label="Phone" {...register('phone')} required />
                <Input label="Logo URL" {...register('logoUrl')} placeholder="https://..." />
                <Input label="Hero Image URL" {...register('heroUrl')} placeholder="https://..." />

                <div className="md:col-span-2">
                    <Input label="Address" {...register('address')} required />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                    <textarea
                        {...register('description')}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium dark:text-gray-300">Location</label>
                    <Controller
                        name="lat"
                        control={control}
                        render={() => (
                            <MapPicker
                                lat={lat}
                                lng={lng}
                                onLocationSelect={(newLat, newLng) => {
                                    setValue('lat', newLat);
                                    setValue('lng', newLng);
                                }}
                            />
                        )}
                    />
                </div>
            </div>

            <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-medium dark:text-gray-300">Gallery Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(watch('gallery') || []).map((url: string, index: number) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group border dark:border-gray-700">
                            <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => {
                                    const current = watch('gallery') || [];
                                    setValue('gallery', current.filter((_: any, i: number) => i !== index));
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                    ))}
                    <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                const url = prompt('Enter Image URL:');
                                if (url) {
                                    const current = watch('gallery') || [];
                                    setValue('gallery', [...current, url]); // For now assuming simple string array. In real app, API returns objects {id, url}. We need to map properly.
                                    // Actually, GET returns { gallery: [{id, url}, ...] }
                                    // We should handle that structure.
                                    // Let's simplify and fix the GET/SET logic in useEffect first or map it here.
                                }
                            }}
                        >
                            + Add Image
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    );
}
