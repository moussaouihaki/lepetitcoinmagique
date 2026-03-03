import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MentionsLegalesPage() {
    return (
        <div className="bg-[#fdfaf6] min-h-screen pt-40 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-[#b38b59] hover:text-[#4a2128] transition-colors mb-12 font-architects">
                    <ArrowLeft size={20} /> Retour à l'accueil
                </Link>

                <h1 className="font-cinzel text-4xl lg:text-5xl text-[#4a2128] mb-12 uppercase tracking-widest text-center">
                    Mentions Légales
                </h1>

                <div className="bg-white border border-[#b38b59]/20 p-8 lg:p-12 shadow-premium rounded-sm space-y-10 font-architects text-gray-700 leading-relaxed">
                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            1. Édition du site
                        </h2>
                        <p>
                            Le site internet <strong>lepetitcoinmagique.ch</strong> est édité par :<br />
                            <strong>Le Petit Coin Magique</strong><br />
                            Responsable de publication : Jennifer du Magasin Le Petit Coin Magique<br />
                            Adresse : Tavannes, Jura Bernois, Suisse<br />
                            Email : lepetitcoinmagique88@gmail.com
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            2. Hébergement
                        </h2>
                        <p>
                            Le site est hébergé par :<br />
                            <strong>Netlify, Inc.</strong><br />
                            44 Montgomery Street, Suite 300<br />
                            San Francisco, California 94104<br />
                            Site web : www.netlify.com
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            3. Propriété intellectuelle
                        </h2>
                        <p>
                            L'ensemble des éléments constituant ce site (textes, graphismes, photographies, logos, etc.) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou adaptation de tout ou partie du site est strictement interdite sans autorisation préalable écrite de l'éditeur.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            4. Données personnelles
                        </h2>
                        <p>
                            Le Petit Coin Magique s'engage à ce que la collecte et le traitement de vos données soient conformes à la loi suisse sur la protection des données (LPD) et au règlement général sur la protection des données (RGPD).<br /><br />
                            Les informations collectées lors d'une commande (nom, adresse, email) sont uniquement utilisées pour le traitement de ladite commande et ne font l'objet d'aucune revente à des tiers.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            5. Cookies
                        </h2>
                        <p>
                            Ce site n'utilise que des cookies techniques nécessaires à son bon fonctionnement (gestion du panier, session de paiement). Aucun cookie de traçage publicitaire n'est utilisé.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
