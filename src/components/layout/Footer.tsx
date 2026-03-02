import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#2a2a2a] text-[#f7f6f2] py-12 font-architects mt-16 shadow-inner">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="font-cinzel text-3xl mb-4 text-[#92544e]">Le Petit Coin Magique</h3>
                    <p className="opacity-80">
                        Créations artisanales venues tout droit du Jura Bernois, pour un quotidien enchanté et mystique.
                    </p>
                </div>
                <div>
                    <h3 className="font-bold mb-4 text-xl">Informations</h3>
                    <ul className="space-y-2 opacity-80">
                        <li><Link href="/notre-equipe-de-createurs" className="hover:text-[#92544e] transition">La Confrérie</Link></li>
                        <li><Link href="/contact" className="hover:text-[#92544e] transition">Nous contacter</Link></li>
                        <li><Link href="/conditions" className="hover:text-[#92544e] transition">Conditions générales de vente</Link></li>
                        <li><Link href="/privacy" className="hover:text-[#92544e] transition">Politique de confidentialité</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4 text-xl">Réseaux Sociaux</h3>
                    <p className="opacity-80 mb-2">
                        Retrouvez-nous pour voir nos dernières nouveautés.
                    </p>
                    <ul className="space-y-2">
                        <li><a href="https://www.facebook.com/profile.php?id=100076310434630" target="_blank" rel="noreferrer" className="hover:text-[#92544e] transition">Facebook</a></li>
                        <li><a href="https://www.instagram.com/le_petit_coin_magique" target="_blank" rel="noreferrer" className="hover:text-[#92544e] transition">Instagram</a></li>
                        <li><a href="https://www.tiktok.com/@le.petit.coin.magique" target="_blank" rel="noreferrer" className="hover:text-[#92544e] transition">TikTok</a></li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mt-12 opacity-50 text-xs font-architects">
                <p>
                    © {new Date().getFullYear()} Le Petit Coin Magique. Tous droits réservés.
                </p>
                <Link href="/admin" className="mt-4 md:mt-0 opacity-40 hover:opacity-100 transition duration-300">
                    Grimoire
                </Link>
            </div>
        </footer>
    );
}
