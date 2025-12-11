import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET Bookings
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    let whereClause: any = {};

    if (session.user.role === 'BUSINESS') {
        const business = await prisma.business.findFirst({ where: { userId: session.user.id } });
        if (!business) return NextResponse.json({ message: 'Business not found' }, { status: 404 });
        whereClause.businessId = business.id;
    } else if (session.user.role === 'CLIENT') {
        whereClause.clientId = session.user.id;
    } else if (session.user.role === 'ADMIN') {
        // Admin can see all or filter? For now, fetch all.
        // Usually admin has separate endpoint or params.
        // Let's restrict to session roles strictly for this route.
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    if (date) {
        whereClause.date = new Date(date);
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: {
                service: true,
                staff: true,
                client: { select: { name: true, email: true, phone: true } },
                business: { select: { name: true } },
            },
            orderBy: { date: 'asc' }, // Upcoming first?
        });
        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching bookings' }, { status: 500 });
    }
}

// POST Create Booking
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CLIENT') {
        return NextResponse.json({ message: 'Only clients can book' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { businessId, serviceId, staffId, date, time } = body;

        // Fetch service price
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) return NextResponse.json({ message: 'Service not found' }, { status: 404 });

        const booking = await prisma.booking.create({
            data: {
                clientId: session.user.id,
                businessId,
                serviceId,
                staffId,
                date: new Date(date),
                time,
                status: 'PENDING',
                totalPrice: service.price,
            }
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating booking' }, { status: 500 });
    }
}

// PUT Update Status (Business Only)
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    // Allow business to confirm/reject, Client to cancel?
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { id, status } = body;

        const booking = await prisma.booking.findUnique({ where: { id } });
        if (!booking) return NextResponse.json({ message: 'Booking not found' }, { status: 404 });

        // Authz checks
        if (session.user.role === 'BUSINESS') {
            const business = await prisma.business.findFirst({ where: { userId: session.user.id } });
            if (booking.businessId !== business?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        } else if (session.user.role === 'CLIENT') {
            if (booking.clientId !== session.user.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
            if (status !== 'CANCELLED') return NextResponse.json({ message: 'Clients can only cancel' }, { status: 403 });
        }

        const updated = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: 'Error updating booking' }, { status: 500 });
    }
}
