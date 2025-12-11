'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function ContactPage() {
    const searchParams = useSearchParams();
    const reason = searchParams?.get('reason');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate sending message
        setTimeout(() => {
            toast.success('Message sent successfully!');
            setName('');
            setEmail('');
            setMessage('');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto px-4 py-12">
                {reason === 'awaiting-approval' && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
                        <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                            Account Pending Approval
                        </h2>
                        <p className="text-yellow-700 dark:text-yellow-400">
                            Your business account is currently under review. Our team will contact you shortly via email once your account is approved.
                        </p>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Get in touch with the Maw3idokom team
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />

                        <Input
                            label="Your Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                placeholder="How can we help you?"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Send Message
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold mb-4">Other Ways to Reach Us</h3>
                        <div className="space-y-2 text-gray-600 dark:text-gray-400">
                            <p>📧 Email: contact@maw3idokom.com</p>
                            <p>📱 Phone: +1 234 567 8900</p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-primary-600 hover:underline">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
