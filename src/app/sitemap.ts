import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://maw3idokom.com';

    const routes = [
        '',
        '/search',
        '/login',
        '/register',
        '/business/register',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const canQueryDb = process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:');
    if (!canQueryDb) return routes;

    let businesses: { id: string; updatedAt: Date }[] = [];
    try {
        businesses = await prisma.business.findMany({
            where: {
                user: { isActive: true },
            },
            select: { id: true, updatedAt: true },
        });
    } catch (error) {
        return routes;
    }

    const businessRoutes = businesses.map((business) => ({
        url: `${baseUrl}/business/${business.id}`,
        lastModified: business.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    return [...routes, ...businessRoutes];
}