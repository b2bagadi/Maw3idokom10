import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.globalSettings.findMany({
            where: {
                key: { in: ['facebook_url', 'instagram_url', 'twitter_url', 'contact_email', 'hero_background_url'] }
            }
        });

        const result: Record<string, string> = {};
        settings.forEach(s => {
            // Prefer English value for URL/Email, or just use raw value logic if you had a different schema
            // Schema has valueEn, valueFr, valueAr. For URLs usually En is fine or all same.
            result[s.key] = s.valueEn;
        });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({}, { status: 500 });
    }
}
