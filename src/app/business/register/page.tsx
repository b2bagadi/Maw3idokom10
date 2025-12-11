'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Select } from '@/components/ui/Select';
import MapPicker from '@/components/ui/MapPicker';
import { registerBusinessSchema } from '@/lib/validations';
import { toast } from 'sonner';
import { z } from 'zod';

type RegisterBusinessFormData = z.infer<typeof registerBusinessSchema>;

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

export default function BusinessRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterBusinessFormData>({
        resolver: zodResolver(registerBusinessSchema),
        defaultValues: {
            lat: 33.5731, // Default Casablanca
            lng: -7.5898,
        },
    });

    // Watch map values to display or ensure they updated
    const lat = watch('lat');
    const lng = watch('lng');

    const onSubmit = async (data: RegisterBusinessFormData) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register-business', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            toast.success('Registration submitted! Please wait for approval.');
            router.push('/contact?reason=awaiting-approval');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600 px-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Register Your Business</h1>
                        <p className="text-gray-600 dark:text-gray-400">Expand your reach with Maw3idokom</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Account Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Account Details</h3>
                                <Input
                                    label="Business Email"
                                    type="email"
                                    {...register('email')}
                                    error={errors.email?.message}
                                    placeholder="business@example.com"
                                    required
                                />
                                <PasswordInput
                                    label="Password"
                                    {...register('password')}
                                    error={errors.password?.message}
                                    placeholder="Strong password"
                                    required
                                />
                            </div>

                            {/* Business Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Business Details</h3>
                                <Input
                                    label="Business Name"
                                    {...register('businessName')}
                                    error={errors.businessName?.message}
                                    placeholder="e.g. Salon Luxe"
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    {...register('phone')}
                                    error={errors.phone?.message}
                                    placeholder="+1 234 567 890"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Select
                                label="Category"
                                {...register('category')}
                                error={errors.category?.message}
                                options={CATEGORY_OPTIONS}
                                required
                            />

                            <Input
                                label="Address"
                                {...register('address')}
                                error={errors.address?.message}
                                placeholder="123 Main St, City"
                                required
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Location (Click to select)
                                </label>
                                <Controller
                                    name="lat"
                                    control={control}
                                    render={() => (
                                        <MapPicker
                                            lat={lat || 33.5731}
                                            lng={lng || -7.5898}
                                            onLocationSelect={(newLat, newLng) => {
                                                setValue('lat', newLat);
                                                setValue('lng', newLng);
                                            }}
                                        />
                                    )}
                                />
                                <div className="text-xs text-gray-500">
                                    Lat: {lat?.toFixed(4)}, Lng: {lng?.toFixed(4)}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full text-lg py-3" isLoading={isLoading}>
                            Submit Registration
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already joined?{' '}
                            <Link href="/login" className="text-primary-600 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
