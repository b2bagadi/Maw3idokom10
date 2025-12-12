'use client';

import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { formatDate, formatPrice, getStatusColor } from '@/lib/utils';
import { MessageSquare, Star, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ClientChat from './ClientChat'; // To be created
import ReviewModal from './ReviewModal';

export default function MyBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chatBooking, setChatBooking] = useState<{ id: string; name: string } | null>(null);
    const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setBookings(data);
        } catch {
            toast.error('Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm('Cancel this appointment?')) return;
        try {
            const res = await fetch('/api/bookings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'CANCELLED' }),
            });
            if (!res.ok) throw new Error('Failed');

            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
            toast.success('Booking cancelled');
        } catch {
            toast.error('Cancellation failed');
        }
    };

    const columns = [
        { header: 'Business', accessor: (b: any) => b.business.name },
        { header: 'Service', accessor: (b: any) => b.service.name },
        { header: 'Date', accessor: (b: any) => `${formatDate(b.date)} @ ${b.time}` },
        { header: 'Price', accessor: (b: any) => formatPrice(b.totalPrice) },
        {
            header: 'Status',
            accessor: (b: any) => (
                <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getStatusColor(b.status))}>
                    {b.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (b: any) => (
                <div className="flex gap-2">
                    {b.status === 'PENDING' && (
                        <Button size="sm" variant="danger" onClick={() => handleCancel(b.id)} title="Cancel">
                            <XCircle size={16} />
                        </Button>
                    )}
                    {b.status === 'COMPLETED' && (
                        <Button size="sm" variant="secondary" onClick={() => setReviewBookingId(b.id)} title="Review">
                            <Star size={16} />
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setChatBooking({ id: b.id, name: b.business.name })}
                        title="Chat"
                    >
                        <MessageSquare size={16} />
                    </Button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">My Bookings</h2>
            <Table
                data={bookings}
                columns={columns}
                keyExtractor={b => b.id}
                isLoading={isLoading}
                emptyMessage="No bookings yet"
            />

            {chatBooking && (
                <ClientChat
                    bookingId={chatBooking.id}
                    businessName={chatBooking.name}
                    isOpen={true}
                    onClose={() => setChatBooking(null)}
                />
            )}

            {reviewBookingId && (
                <ReviewModal
                    bookingId={reviewBookingId}
                    isOpen={true}
                    onClose={() => setReviewBookingId(null)}
                    onReviewSubmitted={fetchBookings}
                />
            )}
        </div>
    );
}
