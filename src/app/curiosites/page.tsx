import ProductCard from '@/components/ProductCard';
import { Product } from '@/store/cart';

async function getProducts() {
    try {
        const fs = require('fs');
        const path = require('path');
        const p = path.join(process.cwd(), 'data', 'products.json');
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
        return [];
    }
}

export default async function CuriositesPage() {
    const allProducts: Product[] = await getProducts();

    const categories = Array.from(new Set(allProducts.map((p) => p.category.toUpperCase())));

    return (
        <div className="container mx-auto px-6 py-20 max-w-[1400px]">
            <div className="text-center mb-24 relative max-w-3xl mx-auto">
                <span className="font-architects text-[#b38b59] text-xl mb-4 block">Découvrez nos envoûtements</span>
                <h1 className="font-cinzel text-5xl md:text-7xl text-[#4a2128] mb-8 uppercase drop-shadow-sm tracking-widest leading-tight">
                    Le Grimoire Complet
                </h1>

                <div className="flex justify-center items-center gap-4 mb-8">
                    <div className="w-12 h-px bg-gradient-to-l from-[#b38b59] to-transparent" />
                    <div className="w-1.5 h-1.5 bg-[#b38b59] rotate-45" />
                    <div className="w-12 h-px bg-gradient-to-r from-[#b38b59] to-transparent" />
                </div>

                <p className="font-architects text-lg md:text-xl text-gray-600 leading-relaxed">
                    Parcourez l'ensemble de nos créations artisanales. Chaque artefact a été forgé, cousu, sculpté ou assemblé avec passion, dans le respect des traditions ésotériques.
                </p>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                    <div className="text-6xl mb-6 opacity-30 filter grayscale">🌫️</div>
                    <p className="font-architects text-2xl text-[#b38b59] max-w-md mx-auto">
                        Le grimoire est encore vide. Revenez plus tard...
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-32">
                    {categories.map((cat) => {
                        const categoryProducts = allProducts.filter((p) => p.category.toUpperCase() === cat);
                        if (categoryProducts.length === 0) return null;

                        return (
                            <section key={cat} className="relative">
                                <div className="flex flex-col items-center text-center mb-16 relative">
                                    <h2 className="font-cinzel text-3xl md:text-4xl text-[#2c2522] uppercase tracking-widest z-10 bg-[#fdfaf6] px-8">
                                        {cat}
                                    </h2>
                                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#b38b59]/40 to-transparent -z-0" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-20 gap-x-12">
                                    {categoryProducts.map((p) => (
                                        <ProductCard key={p.id} product={p} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
