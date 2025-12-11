import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXTAUTH_URL || 'https://maw3idokom.com');

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/dashboard/', '/business/dashboard/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
