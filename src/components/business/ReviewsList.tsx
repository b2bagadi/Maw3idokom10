'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ReviewsList() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Need businessId. But simpler to use session or API infers it from session
        // Since API GET /api/reviews doesn't auto-infer from session if businessId not passed?
        // Let's assume frontend passes businessId OR endpoint infers.
        // The endpoint I wrote: GET /reviews?businessId=...
        // In business dashboard, we are the business.
        // Let's update the API to infer businessId if role is BUSINESS and no specific ID passed?
        // Actually, simpler to fetch profile first, get ID, then fetch reviews.
        // OR: create a specific endpoint /api/businesses/me/reviews?
        // Let's modify the GET logic in React to first get business ID?
        // Or just fetch /api/businesses (profile) which we likely already have in context...
        // For now, I'll fetch valid business profile locally then reviews.

        // Better: GET /api/reviews?role=BUSINESS (auto-infer on server).
        // Let's assume I implemented that or will fix it.
        // Checking API code... I wrote: `if (businessId) where.businessId = businessId;`.
        // It doesn't auto-infer for BUSINESS role session.
        // I should create a separate fetch sequence here.

        fetch('/api/businesses')
            .then(res => res.json())
            .then(business => {
                if (business.id) {
                    return fetch(`/api/reviews?businessId=${business.id}`);
                }
                throw new Error('No business found');
            })
            .then(res => res.json())
            .then(data => {
                setReviews(data);
                setIsLoading(false);
            })
            .catch((e) => {
                console.error(e);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div>Loading reviews...</div>;

    if (reviews.length === 0) return <div className="text-gray-500">No reviews yet.</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-semibold">{review.client.name}</p>
                                <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                            </div>
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1.5} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
