import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CGVPage() {
    return (
        <div className="bg-[#fdfaf6] min-h-screen pt-40 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-[#b38b59] hover:text-[#4a2128] transition-colors mb-12 font-architects">
                    <ArrowLeft size={20} /> Retour à l'accueil
                </Link>

                <h1 className="font-cinzel text-4xl lg:text-5xl text-[#4a2128] mb-12 uppercase tracking-widest text-center">
                    Conditions Générales de Vente
                </h1 >

                <div className="bg-white border border-[#b38b59]/20 p-8 lg:p-12 shadow-premium rounded-sm space-y-10 font-architects text-gray-700 leading-relaxed">
                    <p className="italic text-sm text-gray-400">Dernière mise à jour : Mars 2026</p>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            1. Objet
                        </h2>
                        <p>
                            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre <strong>Le Petit Coin Magique</strong> et toute personne effectuant un achat sur le site <strong>lepetitcoinmagique.ch</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            2. Produits et Prix
                        </h2>
                        <p>
                            Les produits proposés sont des créations artisanales uniques ou en petites séries. Les prix sont indiqués en <strong>Francs Suisses (CHF)</strong>, hors frais de livraison. La TVA n'est pas applicable (selon le statut de l'artisan).
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            3. Commande et Paiement
                        </h2>
                        <p>
                            La validation de la commande intervient après confirmation du paiement. Les paiements sont sécurisés et effectués via la plateforme <strong>Stripe</strong>. Le client reçoit un email de confirmation après chaque validation.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            4. Livraison
                        </h2>
                        <p>
                            Les livraisons sont effectuées principalement en <strong>Suisse</strong>. Les délais d'expédition sont généralement de 1 à 2 jours ouvrés. Les frais de port sont calculés lors du passage à la caisse et incluent l'emballage sécurisé des objets souvent fragiles.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            5. Droit de rétractation
                        </h2>
                        <p>
                            Conformément à l'usage, le client dispose d'un délai de 14 jours après réception pour signaler un souhait de retour, à condition que l'article soit renvoyé dans son état d'origine. Les frais de retour sont à la charge du client.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-cinzel text-xl text-[#4a2128] mb-4 uppercase tracking-wider border-b border-[#b38b59]/20 pb-2">
                            6. Droit applicable et juridiction
                        </h2>
                        <p>
                            Les présentes conditions sont soumises au <strong>droit suisse</strong>. En cas de litige, le for juridique est situé à <strong>Moutier (Jura Bernois)</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
