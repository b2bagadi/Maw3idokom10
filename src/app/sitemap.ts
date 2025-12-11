import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXTAUTH_URL || 'https://maw3idokom.com');

    // Static routes
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

    // Dynamic Business routes
    const businesses = await prisma.business.findMany({
        where: {
            user: { isActive: true } // Only active businesses
        },
        select: { id: true, updatedAt: true }
    });

    const businessRoutes = businesses.map((business) => ({
        url: `${baseUrl}/business/${business.id}`,
        lastModified: business.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    return [...routes, ...businessRoutes];
}
