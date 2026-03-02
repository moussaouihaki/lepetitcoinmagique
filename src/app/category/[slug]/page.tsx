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

const CATEGORY_INFO: Record<string, { title: string; description: React.ReactNode }> = {
    'LES PETITS CHAUDRONS': {
        title: 'Les Petits Chaudrons Magiques',
        description: (
            <>
                Découvrez la magie de nos petits chaudrons, créés avec soin à la main dans notre atelier.<br /><br />
                Chaque chaudron est unique, imprégné d'une touche ésotérique pour enrichir vos moments de détente.<br /><br />
                Explorez notre collection et trouvez le chaudron qui résonnera avec votre âme.
            </>
        )
    },
    'POTERIE': {
        title: "Créations d'Argile",
        description: (
            <>
                Des poteries artisanales façonnées avec passion, idéales pour accueillir vos encens, plantes ou petits secrets magiques.<br /><br />
                Chaque pièce, issue de la terre et du feu, est unique et forgée pour vos rituels quotidiens.
            </>
        )
    },
    'FORGE': {
        title: "L'Art de la Forge",
        description: (
            <>
                Des créations métalliques forgées à la main avec respect et dévotion.<br /><br />
                Découvrez nos couteaux nordiques, haches protectrices et objets rituels nés de l'alliance brute du feu et de l'acier.
            </>
        )
    },
    'PYROGRAVURE': {
        title: "L'Esprit du Bois",
        description: (
            <>
                Des œuvres uniques gravées par le feu, représentant des symboles sacrés et des protecteurs ancestraux.<br /><br />
                Une magie naturelle et intemporelle capturée pour décorer et protéger votre foyer.
            </>
        )
    },
    'GRAVURE SUR VERRE': {
        title: "Éclats de Lumière",
        description: (
            <>
                Bouteilles et réceptacles en verre minutieusement gravés pour amplifier vos énergies.<br /><br />
                Idéal pour dynamiser vos eaux, conserver vos potions et purifier votre espace de méditation.
            </>
        )
    },
    'BIJOUX': {
        title: "Parures Mystiques",
        description: (
            <>
                Des bijoux faits main alliant cristaux naturels, pierres semi-précieuses et éléments sylvestres.<br /><br />
                Créés avec intention pour rehausser vos vibrations journalières et vous accompagner avec élégance.
            </>
        )
    },
    'LES POILUS': {
        title: "Pour Nos Familiers",
        description: (
            <>
                Découvrez des accessoires et créations uniques, faits avec amour pour vos compagnons à quatre pattes.<br /><br />
                Parce que nos petits protecteurs méritent aussi de la magie au quotidien.
            </>
        )
    },
    'CURIOSITÉS': {
        title: "La Chambre des Merveilles",
        description: (
            <>
                Des artefacts rares, puissants et énigmatiques qui sortent de l'ordinaire.<br /><br />
                Laissez-vous séduire par des objets magiques hors du commun qui attendent leur futur gardien.
            </>
        )
    },
    'CURIOSITÉ': {
        title: "La Chambre des Merveilles",
        description: (
            <>
                Des artefacts rares, puissants et énigmatiques qui sortent de l'ordinaire.<br /><br />
                Laissez-vous séduire par des objets magiques hors du commun qui attendent leur futur gardien.
            </>
        )
    }
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug).toUpperCase();
    const allProducts: Product[] = await getProducts();

    const categoryProducts = allProducts.filter(
        (p) => p.category.toUpperCase() === decodedSlug || p.category.toUpperCase() === decodedSlug + 'S'
    );

    const info = CATEGORY_INFO[decodedSlug] || { title: decodedSlug, description: "Des merveilles forgées pour votre éveil spirituel." };

    return (
        <div className="container mx-auto px-6 py-20 max-w-[1400px]">
            <div className="text-center mb-24 relative max-w-3xl mx-auto">
                <span className="font-architects text-[#b38b59] text-xl mb-4 block">Le Grimoire - Chapitre</span>
                <h1 className="font-cinzel text-5xl md:text-7xl text-[#4a2128] mb-8 uppercase drop-shadow-sm tracking-widest leading-tight">
                    {info.title}
                </h1>

                <div className="flex justify-center items-center gap-4 mb-8">
                    <div className="w-12 h-px bg-gradient-to-l from-[#b38b59] to-transparent" />
                    <div className="w-1.5 h-1.5 bg-[#b38b59] rotate-45" />
                    <div className="w-12 h-px bg-gradient-to-r from-[#b38b59] to-transparent" />
                </div>

                <div className="font-architects text-lg md:text-xl text-gray-600 leading-relaxed">
                    {info.description}
                </div>
            </div>

            {categoryProducts.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                    <div className="text-6xl mb-6 opacity-30 filter grayscale">🌫️</div>
                    <p className="font-architects text-2xl text-[#b38b59] max-w-md mx-auto">
                        Cette section du grimoire est encore vide. Revenez plus tard...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-20 gap-x-12">
                    {categoryProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}
