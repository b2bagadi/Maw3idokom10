import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET Business Profile
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'BUSINESS') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const business = await prisma.business.findFirst({
            where: { userId: session.user.id },
            include: {
                category: true,
                subscriptionPlan: true,
                gallery: true, // Include gallery images
            }
        });

        if (!business) return NextResponse.json({ message: 'Business not found' }, { status: 404 });

        return NextResponse.json(business);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
    }
}

// UPDATE Business Profile
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'BUSINESS') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, description, address, phone, lat, lng, logoUrl, heroUrl, categoryId, gallery } = body;

        // Transaction to handle business update + gallery sync if needed
        // For simplicity, we'll just update business fields and assume gallery is handled via separate endpoints OR basic list replacement if simple.
        // Let's implement a simple list replacement for gallery here if provided.

        await prisma.business.update({
            where: { userId: session.user.id },
            data: {
                name,
                description,
                address,
                phone,
                lat,
                lng,
                logoUrl,
                heroUrl,
                categoryId,
            }
        });

        // If gallery URLs provided, sync them (Delete all for this business and re-create)
        // Note: In a real app, you'd want granular add/remove.
        if (Array.isArray(gallery)) {
            // First get business ID
            const business = await prisma.business.findFirst({ where: { userId: session.user.id } });

            if (business) {
                await prisma.$transaction([
                    prisma.businessImage.deleteMany({ where: { businessId: business.id } }),
                    prisma.businessImage.createMany({
                        data: gallery.map((url: string) => ({ url, businessId: business.id }))
                    })
                ]);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating profile' }, { status: 500 });
    }
}
