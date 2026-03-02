import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

export default function ContactPage() {
    return (
        <div className="flex flex-col w-full overflow-hidden bg-[#FDFBF8] min-h-screen">
            <section className="relative px-6 py-24 border-b border-[#b38b59]/20">
                <div className="absolute inset-x-8 top-8 bottom-0 border-t border-x border-[#b38b59]/10 rounded-t-[3rem] pointer-events-none" />

                <div className="container mx-auto max-w-[1200px] text-center relative z-10 pt-16">
                    <span className="font-architects text-[#b38b59] text-2xl mb-6 block">Échange & Partage</span>
                    <h1 className="font-cinzel text-5xl md:text-7xl text-[#4a2128] mb-8 uppercase drop-shadow-sm tracking-widest leading-tight">
                        Nous Contacter
                    </h1>

                    <div className="flex justify-center items-center gap-4 mb-12">
                        <div className="w-16 h-px bg-gradient-to-l from-[#b38b59] to-transparent" />
                        <div className="w-2 h-2 bg-[#b38b59] rotate-45" />
                        <div className="w-16 h-px bg-gradient-to-r from-[#b38b59] to-transparent" />
                    </div>

                    <p className="font-architects text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-16">
                        "C'est ici que la Magie opère..."<br /><br />
                        Avez-vous une question sur un artefact, une demande de création sur mesure, ou souhaitez-vous simplement échanger sur l'art ésotérique ? N'hésitez pas à nous envoyer un message par hibou, ou plus simplement, par les moyens ci-dessous.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 gap-y-16">

                        {/* Address */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 w-16 h-16 rounded-full border border-[#b38b59] flex items-center justify-center bg-[#FDFBF8] group-hover:bg-[#4a2128] group-hover:border-[#4a2128] transition-colors duration-500 text-[#b38b59] group-hover:text-white">
                                <MapPin strokeWidth={1.5} size={28} />
                            </div>
                            <h3 className="font-cinzel text-2xl mb-3 text-[#2c2522] tracking-wider uppercase">L'Échoppe</h3>
                            <div className="h-px w-10 bg-[#b38b59] mb-4" />
                            <p className="font-architects text-lg text-gray-500 leading-relaxed">
                                Grand-Rue 13<br />
                                2710 Tavannes<br />
                                Suisse
                            </p>
                        </div>

                        {/* Schedule */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 w-16 h-16 rounded-full border border-[#b38b59] flex items-center justify-center bg-[#FDFBF8] group-hover:bg-[#4a2128] group-hover:border-[#4a2128] transition-colors duration-500 text-[#b38b59] group-hover:text-white">
                                <Clock strokeWidth={1.5} size={28} />
                            </div>
                            <h3 className="font-cinzel text-2xl mb-3 text-[#2c2522] tracking-wider uppercase">Horaires</h3>
                            <div className="h-px w-10 bg-[#b38b59] mb-4" />
                            <ul className="font-architects text-lg text-gray-500 leading-relaxed">
                                <li>Lundi - Mercredi : <span className="text-[#4a2128] opacity-70">Fermé</span></li>
                                <li>Jeudi : 14h30 – 18h00</li>
                                <li>Vendredi : 10h00 – 12h00, 14h30 – 18h00</li>
                                <li>Samedi : 09h00 – 12h00</li>
                                <li>Dimanche : <span className="text-[#4a2128] opacity-70">Fermé</span></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 w-16 h-16 rounded-full border border-[#b38b59] flex items-center justify-center bg-[#FDFBF8] group-hover:bg-[#4a2128] group-hover:border-[#4a2128] transition-colors duration-500 text-[#b38b59] group-hover:text-white">
                                <Phone strokeWidth={1.5} size={28} />
                            </div>
                            <h3 className="font-cinzel text-2xl mb-3 text-[#2c2522] tracking-wider uppercase">Téléphone</h3>
                            <div className="h-px w-10 bg-[#b38b59] mb-4" />
                            <p className="font-architects text-lg text-gray-500 leading-relaxed mb-4">
                                Appels ou WhatsApp
                            </p>
                            <a href="tel:+41782502187" className="font-cinzel text-xl text-[#b38b59] hover:text-[#4a2128] transition-colors">
                                +41 78 250 21 87
                            </a>
                        </div>

                        {/* Social */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="mb-6 w-16 h-16 rounded-full border border-[#b38b59] flex items-center justify-center bg-[#FDFBF8] group-hover:bg-[#4a2128] group-hover:border-[#4a2128] transition-colors duration-500 text-[#b38b59] group-hover:text-white">
                                <Mail strokeWidth={1.5} size={28} />
                            </div>
                            <h3 className="font-cinzel text-2xl mb-3 text-[#2c2522] tracking-wider uppercase">Réseaux</h3>
                            <div className="h-px w-10 bg-[#b38b59] mb-4" />
                            <p className="font-architects text-lg text-gray-500 leading-relaxed mb-6">
                                Suivez nos rituels et nouveautés.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://instagram.com/le_petit_coin_magique" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#b38b59] hover:bg-[#b38b59] hover:text-white transition-colors">
                                    <Instagram size={20} />
                                </a>
                                <a href="https://facebook.com/profile.php?id=100076310434630" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#b38b59] hover:bg-[#b38b59] hover:text-white transition-colors">
                                    <Facebook size={20} />
                                </a>
                                <a href="https://tiktok.com/@le.petit.coin.magique" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#b38b59] hover:bg-[#b38b59] hover:text-white transition-colors">
                                    <FaTiktok size={18} />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
