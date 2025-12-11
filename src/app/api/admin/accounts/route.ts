import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            include: {
                business: {
                    select: {
                        name: true,
                        subscriptionPlan: true,
                    }
                },
                _count: {
                    select: {
                        clientBookings: true,
                        clientReviews: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching accounts' }, { status: 500 });
    }
}
