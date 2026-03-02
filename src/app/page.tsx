import ProductCard from '@/components/ProductCard';
import { Product } from '@/store/cart';
import Image from 'next/image';

async function getProducts() {
  try {
    const fs = require('fs');
    const path = require('path');
    const p = path.join(process.cwd(), 'data', 'products.json');
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export default async function Home() {
  const products: Product[] = await getProducts();

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#FDFBF8]">
      {/* 
        MAGNIFICENT HERO SECTION
      */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-b-[8px] border-[#b38b59]/10 pb-24">

        {/* Decorative background framing */}
        <div className="absolute inset-8 border border-[#b38b59]/20 pointer-events-none" />
        <div className="absolute inset-10 border border-[#b38b59]/10 pointer-events-none hidden md:block" />

        {/* Corner Ornaments */}
        <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 border-[#b38b59]/40 pointer-events-none" />
        <div className="absolute top-12 right-12 w-16 h-16 border-t-2 border-r-2 border-[#b38b59]/40 pointer-events-none" />
        <div className="absolute bottom-12 left-12 w-16 h-16 border-b-2 border-l-2 border-[#b38b59]/40 pointer-events-none" />
        <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 border-[#b38b59]/40 pointer-events-none" />

        <div className="container mx-auto px-6 z-10 flex flex-col items-center text-center mt-20">

          <span className="font-architects text-[#b38b59] text-xl md:text-2xl mb-6">
            Aux confins de la magie & du Jura Bernois
          </span>

          <h1 className="font-cinzel text-4xl md:text-5xl lg:text-7xl text-[#2c2522] leading-[1] tracking-tight mix-blend-multiply drop-shadow-sm mb-6 mt-2">
            Le Petit<br />
            <span className="gold-gradient-text italic opacity-90 relative">
              Coin Magique
            </span>
          </h1>

          <div className="w-px h-16 bg-gradient-to-b from-[#b38b59] to-transparent mb-8" />

          <p className="font-cinzel tracking-widest uppercase text-sm md:text-md text-gray-500 max-w-2xl mx-auto leading-loose">
            L'excellence de la force cosmique.<br /> Des créations forgées avec respect et dévotion.
          </p>

          <a href="#nouveautes" className="mt-16 group relative flex items-center justify-center p-1">
            <div className="absolute inset-0 bg-[#4a2128] scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
            <div className="relative px-12 py-5 bg-transparent border border-[#b38b59] group-hover:border-[#4a2128] rounded-full transition-colors duration-500 flex items-center gap-4">
              <span className="font-cinzel tracking-[0.2em] uppercase text-sm font-bold text-[#4a2128] group-hover:text-white transition-colors duration-500">
                Franchir le Seuil
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* Exquisite Pillars Section */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center mb-16">
            <span className="font-architects text-xl text-[#b38b59]">Le savoir-faire</span>
            <h2 className="font-cinzel text-4xl md:text-5xl text-[#4a2128] mt-3 uppercase tracking-widest">Les Arts Essentiels</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 px-4">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center text-center group max-w-xs mx-auto">
              <div className="mb-6 overflow-hidden rounded-t-full w-full aspect-[4/5] border-2 border-[#f5f1ea] relative bg-[#fdfaf8] shadow-sm">
                <Image
                  src="/images/pillars/feu.png"
                  alt="La Forge"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-2 border border-white/50 rounded-t-full flex items-center justify-center bg-[#4a2128]/30 group-hover:bg-[#4a2128]/10 transition-colors duration-500">
                  <span className="font-cinzel text-5xl text-white opacity-90 drop-shadow-md">I</span>
                </div>
              </div>
              <h3 className="font-cinzel text-2xl mb-3 text-[#2c2522] tracking-wider uppercase">L'Élément Feu</h3>
              <div className="h-px w-10 bg-[#b38b59] mb-3" />
              <p className="font-architects text-base text-gray-500 leading-relaxed px-4">La Forge. Un travail de la matière brute pour donner naissance à des protecteurs métalliques.</p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center text-center group mt-0 md:mt-12 max-w-xs mx-auto">
              <div className="mb-6 overflow-hidden rounded-t-full w-full aspect-[4/5] border-2 border-[#f5f1ea] relative bg-[#fdfaf8] shadow-sm">
                <Image
                  src="/images/pillars/terre.png"
                  alt="La Terre"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-2 border border-white/50 rounded-t-full flex items-center justify-center bg-[#b38b59]/30 group-hover:bg-[#b38b59]/10 transition-colors duration-500">
                  <span className="font-cinzel text-5xl text-white opacity-90 drop-shadow-md">II</span>
                </div>
              </div>
              <h3 className="font-cinzel text-2xl mb-3 text-[#2c2522] tracking-wider uppercase">L'Élément Terre</h3>
              <div className="h-px w-10 bg-[#b38b59] mb-3" />
              <p className="font-architects text-base text-gray-500 leading-relaxed px-4">Poteries et petits chaudrons d'argile, pour accueillir les effluves de vos encens sacrés.</p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center text-center group max-w-xs mx-auto">
              <div className="mb-6 overflow-hidden rounded-t-full w-full aspect-[4/5] border-2 border-[#f5f1ea] relative bg-[#fdfaf8] shadow-sm">
                <Image
                  src="/images/pillars/bijoux.png"
                  alt="L'Éclat Mystique"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-2 border border-white/50 rounded-t-full flex items-center justify-center bg-[#4a2128]/30 group-hover:bg-[#4a2128]/10 transition-colors duration-500">
                  <span className="font-cinzel text-5xl text-white opacity-90 drop-shadow-md">III</span>
                </div>
              </div>
              <h3 className="font-cinzel text-2xl mb-3 text-[#2c2522] tracking-wider uppercase">L'Éclat Mystique</h3>
              <div className="h-px w-10 bg-[#b38b59] mb-3" />
              <p className="font-architects text-base text-gray-500 leading-relaxed px-4">Bijoux et pierres, méticuleusement sélectionnés pour rehausser vos vibrations journalières.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section id="nouveautes" className="container mx-auto px-6 py-20 max-w-[1400px] border-t border-gold/20">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-architects text-[#b38b59] text-xl mb-3">La chambre des merveilles</span>
          <h2 className="font-cinzel text-4xl md:text-5xl text-[#4a2128] uppercase tracking-widest drop-shadow-sm">Artefacts Choisis</h2>
          <div className="w-1.5 h-1.5 bg-[#b38b59] rotate-45 mt-6" />
        </div>

        {products.length === 0 ? (
          <p className="text-center text-[#b38b59] font-architects text-2xl">Les mystères restent cachés pour l'instant...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-12">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-40 text-center flex flex-col items-center">
          <div className="w-px h-24 bg-gradient-to-b from-transparent to-[#b38b59] mb-8" />
          <a href="/curiosites" className="group inline-flex items-center justify-center px-16 py-6 border border-[#4a2128] hover:bg-[#4a2128] transition-colors duration-700">
            <span className="font-cinzel tracking-widest text-[#4a2128] group-hover:text-white uppercase transition-colors">
              Ouvrir le Grimoire Complet
            </span>
          </a>
        </div>
      </section>

    </div>
  );
}
