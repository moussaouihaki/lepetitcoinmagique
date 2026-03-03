import ProductCard from '@/components/ProductCard';
import { Product } from '@/store/cart';
import Image from 'next/image';
import Link from 'next/link';
import { getProductsFromFirebase } from '@/lib/products';
import { Truck, Store, Sparkles } from 'lucide-react';

export default async function Home() {
  const allProducts: Product[] = await getProductsFromFirebase();
  const categories = Array.from(new Set(allProducts.map((p) => (p.category || '').toUpperCase()))).filter(Boolean).sort();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Le Petit Coin Magique',
    'image': 'https://lepetitcoinmagique.ch/images/pillars/terre.png',
    '@id': 'https://lepetitcoinmagique.ch',
    'url': 'https://lepetitcoinmagique.ch',
    'telephone': '+41 78 250 21 87',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Grand-Rue 13',
      'addressLocality': 'Tavannes',
      'postalCode': '2710',
      'addressCountry': 'CH'
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#FDFBF8]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 
        NEW INTEGRATED HERO & WELCOME
      */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden border-b-[8px] border-[#b38b59]/10 pt-32 pb-24">
        {/* Decorative Framing */}
        <div className="absolute inset-8 border border-[#b38b59]/10 pointer-events-none" />
        <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-[#b38b59]/30 pointer-events-none" />
        <div className="absolute top-12 right-12 w-12 h-12 border-t border-r border-[#b38b59]/30 pointer-events-none" />

        <div className="container mx-auto px-6 z-10 text-center max-w-4xl">
          <span className="font-architects text-[#b38b59] text-xl tracking-widest mb-6 block uppercase">
            Aux confins de la magie & du Jura Bernois
          </span>

          <h1 className="font-cinzel text-5xl md:text-8xl text-[#2c2522] leading-[1.1] mb-12 uppercase tracking-wide">
            Le Petit<br />
            <span className="gold-gradient-text italic">Coin Magique</span>
          </h1>

          <div className="space-y-8 mb-16">
            <h2 className="font-cinzel text-lg md:text-xl text-[#b38b59] tracking-[0.4em] uppercase italic opacity-80">
              Bienvenue dans notre univers
            </h2>
            <p className="font-architects text-xl md:text-2xl text-gray-700 leading-relaxed italic">
              "C'est ici que la Magie opère..."
            </p>
            <p className="font-architects text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Votre destination privilégiée pour des produits ésotériques artisanaux uniques,
              créés pour illuminer votre quotidien et vous connecter aux énergies de la Terre.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-12 pb-8 border-b border-[#b38b59]/10">
            {[
              { icon: Truck, label: 'Livraison Suisse & Europe' },
              { icon: Store, label: 'Retrait à Tavannes' },
              { icon: Sparkles, label: 'Artisanat Fait Main' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-[#4a2128]">
                <div className="p-2 bg-[#fdfaf6] rounded-full border border-[#b38b59]/20">
                  <Icon size={20} />
                </div>
                <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase font-bold">{label}</span>
              </div>
            ))}
          </div>

          <a href="#boutique" className="mt-16 group inline-flex items-center gap-4 px-12 py-5 bg-[#4a2128] text-white rounded-full transition-all hover:bg-[#b38b59] hover:translate-y-[-2px] shadow-xl shadow-[#4a2128]/10">
            <span className="font-cinzel tracking-widest uppercase text-sm font-bold">Explorer le Grimoire</span>
            <div className="w-1 h-1 bg-white rotate-45 group-hover:rotate-180 transition-transform duration-500" />
          </a>
        </div>

        {/* Ethereal background aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[500px] bg-[#b38b59]/5 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Exquisite Pillars Section */}
      <section className="py-24 bg-white border-b border-[#b38b59]/5">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 px-4">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center text-center group max-w-xs mx-auto">
              <div className="mb-6 overflow-hidden rounded-t-full w-full aspect-[4/5] border border-[#f5f1ea] relative bg-[#fdfaf8]">
                <Image src="/images/pillars/feu.png" alt="La Forge" fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-2 border border-white/50 rounded-t-full flex items-center justify-center bg-[#4a2128]/20" />
              </div>
              <h3 className="font-cinzel text-xl mb-3 text-[#2c2522] tracking-wider uppercase">Le Feu</h3>
              <p className="font-architects text-sm text-gray-400 italic">L'Art de la Forge</p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center text-center group mt-8 md:mt-16 max-w-xs mx-auto">
              <div className="mb-6 overflow-hidden rounded-t-full w-full aspect-[4/5] border border-[#f5f1ea] relative bg-[#fdfaf8]">
                <Image src="/images/pillars/terre.png" alt="La Terre" fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-2 border border-white/50 rounded-t-full flex items-center justify-center bg-[#b38b59]/20" />
              </div>
              <h3 className="font-cinzel text-xl mb-3 text-[#2c2522] tracking-wider uppercase">La Terre</h3>
              <p className="font-architects text-sm text-gray-400 italic">Poterie & Argile Sacrée</p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center text-center group max-w-xs mx-auto">
              <div className="mb-6 overflow-hidden rounded-t-full w-full aspect-[4/5] border border-[#f5f1ea] relative bg-[#fdfaf8]">
                <Image src="/images/pillars/bijoux.png" alt="L'Air" fill className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-2 border border-white/50 rounded-t-full flex items-center justify-center bg-[#4a2128]/20" />
              </div>
              <h3 className="font-cinzel text-xl mb-3 text-[#2c2522] tracking-wider uppercase">L'Éclat</h3>
              <p className="font-architects text-sm text-gray-400 italic">Bijoux & Pierres Uniques</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery - Back to selective view */}
      <section id="nouveautes" className="container mx-auto px-6 py-32 max-w-[1400px]">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-architects text-[#b38b59] text-xl mb-3 italic">La chambre des merveilles</span>
          <h2 className="font-cinzel text-4xl md:text-5xl text-[#4a2128] uppercase tracking-widest drop-shadow-sm">Artefacts Choisis</h2>
          <div className="w-1.5 h-1.5 bg-[#b38b59] rotate-45 mt-6" />
        </div>

        {allProducts.length === 0 ? (
          <p className="text-center text-[#b38b59] font-architects text-2xl italic">Les mystères restent cachés pour l'instant...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-12">
            {allProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-40 text-center flex flex-col items-center">
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-[#b38b59] mb-8" />
          <Link href="/curiosites" className="group inline-flex items-center justify-center px-16 py-6 border border-[#4a2128] hover:bg-[#4a2128] transition-colors duration-700">
            <span className="font-cinzel tracking-widest text-[#4a2128] group-hover:text-white uppercase transition-colors">
              Ouvrir le Grimoire Complet
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
// Force fresh Vercel build - 22:52
