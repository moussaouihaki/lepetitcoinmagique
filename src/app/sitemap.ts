import { MetadataRoute } from 'next';
import { getProductsFromFirebase } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://lepetitcoinmagique.ch';

    // Base routes
    const routes = [
        '',
        '/contact',
        '/curiosites',
        '/equipe',
        '/cgv',
        '/mentions-legales',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic product routes
    try {
        const products = await getProductsFromFirebase();
        const productRoutes = products.map((p) => ({
            url: `${baseUrl}/product/${p.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
        return [...routes, ...productRoutes];
    } catch (e) {
        console.error('Sitemap error:', e);
        return routes;
    }
}
