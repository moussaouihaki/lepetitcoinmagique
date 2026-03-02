import Image from 'next/image';
import { Instagram, Facebook, Globe } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

type SocialLinks = {
    website?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
};

const CREATORS: { name: string; role: string; desc: string; image?: string; links?: SocialLinks }[] = [
    {
        name: "Myrtille C'fils",
        role: "Couture & Création Textile",
        desc: "Des étoffes tissées avec soin pour donner vie à des pièces uniques et chaleureuses.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/collage_2025-06-10_16_17_15-1-standard.jpg",
        links: { instagram: "https://instagram.com/myrtille_cfils" }
    },
    {
        name: "Aweliel",
        role: "Bijouterie Artisanale",
        desc: "Des parures faites main, capturant l'essence des éléments dans des métaux précieux et des cristaux.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_204039-1-standard.jpg",
        links: { instagram: "https://instagram.com/aweliel", facebook: "https://facebook.com/profile.php?id=61563094082169" }
    },
    {
        name: "Moineau",
        role: "Maroquinerie & Travail du Cuir",
        desc: "L'art de façonner le cuir pour créer des sacs et accessoires robustes au charme d'antan.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_203914-1-standard.jpg",
        links: { website: "https://moineau-leatherwork.com", instagram: "https://instagram.com/moineau_leatherwork", tiktok: "https://tiktok.com/@moineau_leatherwork" }
    },
    {
        name: "Gaëlle BodyArt",
        role: "Art Corporel & Tatouages",
        desc: "Henné et ornements corporels pour graver vos histoires sur la peau. Académie Breizh Tattoo.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_211454-1-standard.jpg",
        links: { website: "https://breizhtattooacademy.com", instagram: "https://instagram.com/gaellebodyart", facebook: "https://facebook.com/breizhtattooacademy", tiktok: "https://tiktok.com/@gaellebodyart" }
    },
    {
        name: "Au Beau Bois",
        role: "L'Âme de la Forêt",
        desc: "Un travail méticuleux et respectueux du bois pour sculpter des objets décoratifs et rituels.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_203930-1-standard.jpg",
        links: { website: "https://aubeaubois.ch", facebook: "https://facebook.com/profile.php?id=61559499320991", tiktok: "https://tiktok.com/@aubeaubois" }
    },
    {
        name: "Mon Armoire à Trésors",
        role: "Curiosités & Seconde Main",
        desc: "Une sélection magique de pépites vintage et d'objets enchanteurs rescapés du temps.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_204021-1-standard.jpg",
        links: { facebook: "https://facebook.com/profile.php?id=100057643531801", instagram: "https://instagram.com/monarmoireatresors" }
    },
    {
        name: "Mélillustrations",
        role: "Illustrations & Dessins",
        desc: "Des œuvres picturales qui donnent forme aux mythes, légendes et visions oniriques.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_204118-1-standard.jpg",
        links: { instagram: "https://instagram.com/melillustrations_nature" }
    },
    {
        name: "KréatiVa",
        role: "Créations Personnalisées",
        desc: "Objets sur mesure et cadeaux originaux, infusés d'une intention particulière.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_204059-1-standard.jpg",
        links: { facebook: "https://facebook.com/profile.php?id=61564665221582", instagram: "https://instagram.com/kreativa08" }
    },
    {
        name: "Jolidon Soin et bien-être",
        role: "Cosmétiques Naturels",
        desc: "Des onguents, baumes et soins issus des plantes pour nourrir le corps et l'esprit.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_204004-1-standard.jpg",
        links: { website: "https://www.onedoc.ch/fr/therapeute-en-bioresonance/saicourt/pcocx/djemila-jolidon", facebook: "https://facebook.com/jolidonsoinsetbienetre", instagram: "https://instagram.com/soins_djem" }
    },
    {
        name: "Les Gâteries de Déb",
        role: "Gourmandises Artisanales",
        desc: "Pâtisseries et douceurs envoûtantes pour régaler vos papilles lors des fêtes païennes.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/img_20250522_203852-1-standard.jpg",
        links: { website: "https://www.lesgateriesdedeb.ch", facebook: "https://facebook.com/lesgateriesdedeb", instagram: "https://instagram.com/lesgateriesdedeb" }
    },
    {
        name: "La Magie de Mina",
        role: "Décorations Enchantées",
        desc: "Chaudrons, balais rustiques et décorations pour faire entrer la magie dans votre foyer.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/collage_2025-06-10_20_22_43-1-standard.jpg",
        links: { website: "https://lamagiedemina.shop", facebook: "https://facebook.com/groups/432892102881149", instagram: "https://instagram.com/lamagiedemina" }
    },
    {
        name: "Tisalia",
        role: "Thés & Infusions",
        desc: "La magie des plantes mise en sachet. Découvrez les mélanges du 'Chaudron Magique'.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/collage_2025-06-10_20_33_40-1-standard.jpg",
        links: { website: "https://www.tisalia.ch", facebook: "https://facebook.com/Tisalia.Suisse", instagram: "https://instagram.com/tisalia.ch" }
    },
    {
        name: "La l'iris",
        role: "Bougies & Fondants Parfumés",
        desc: "Des lueurs parfumées pour purifier l'air et accompagner vos méditations.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/collage_2025-06-10_20_20_47-1-standard.jpg",
        links: { website: "https://www.laliris.ch", facebook: "https://facebook.com/iris.danz" }
    },
    {
        name: "Fashion Baby Cake's",
        role: "Cadeaux de Naissance",
        desc: "Gâteaux de couches et présents féeriques pour accueillir les nouvelles âmes.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/collage_2025-06-10_20_34_06-1-standard-7sbjoo.jpg",
        links: { facebook: "https://facebook.com/profile.php?id=100063495814928" }
    },
    {
        name: "Happy Stone",
        role: "Lithothérapie & Cristaux",
        desc: "Des minéraux et pierres de soin sélectionnés pour leurs vibrations curatives et protectrices.",
        image: "https://primary.jwwb.nl/public/w/h/t/temp-ubihcddpkpizlqxqtbor/collage_2025-06-10_20_33_55-1-standard-rcq049.jpg"
    }
];

export default function TeamPage() {
    return (
        <div className="flex flex-col w-full overflow-hidden bg-[#FDFBF8] min-h-screen">
            <section className="relative px-6 py-24 border-b border-[#b38b59]/20">
                <div className="absolute inset-x-8 top-8 bottom-0 border-t border-x border-[#b38b59]/10 rounded-t-[3rem] pointer-events-none" />

                <div className="container mx-auto max-w-[1200px] text-center relative z-10 pt-16">
                    <span className="font-architects text-[#b38b59] text-2xl mb-6 block">Au cœur de Tavannes</span>
                    <h1 className="font-cinzel text-5xl md:text-7xl text-[#4a2128] mb-8 uppercase drop-shadow-sm tracking-widest leading-tight">
                        Notre Confrérie<br />de Créateurs
                    </h1>

                    <div className="flex justify-center items-center gap-4 mb-12">
                        <div className="w-16 h-px bg-gradient-to-l from-[#b38b59] to-transparent" />
                        <div className="w-2 h-2 bg-[#b38b59] rotate-45" />
                        <div className="w-16 h-px bg-gradient-to-r from-[#b38b59] to-transparent" />
                    </div>

                    <p className="font-architects text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-16">
                        Le Petit Coin Magique n'est pas qu'une simple échoppe. C'est une synergie créative, un lieu de rassemblement pour des artisans passionnés qui insufflent une touche de magie, d'histoire et de savoir-faire dans chacune de leurs œuvres. Découvrez le cercle de notre confrérie.
                    </p>
                </div>
            </section>

            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6 max-w-[1400px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-20">
                        {CREATORS.map((creator, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="mb-10 relative flex items-center justify-center p-2">
                                    <div className="absolute inset-0 border border-[#b38b59] rotate-45 transition-transform duration-700 group-hover:rotate-90 group-hover:bg-[#4a2128]/5" />
                                    <div className="w-28 h-28 bg-[#FDFBF8] p-1 shadow-sm flex items-center justify-center relative z-10 transition-colors duration-500 group-hover:border-[#4a2128]">
                                        <div className="relative w-full h-full overflow-hidden">
                                            {creator.image ? (
                                                <Image
                                                    src={creator.image}
                                                    alt={creator.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, 112px"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-[#f5f1ea]">
                                                    <span className="font-cinzel text-3xl text-[#b38b59] group-hover:text-[#4a2128] transition-colors duration-500">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="font-cinzel text-2xl mb-1 text-[#2c2522] tracking-wider uppercase">{creator.name}</h3>
                                <p className="font-cinzel text-sm text-[#b38b59] mb-4 tracking-widest">{creator.role}</p>
                                <div className="h-px w-12 bg-[#b38b59]/50 mb-4" />
                                <p className="font-architects text-lg text-gray-500 leading-relaxed px-4 mb-6 flex-grow">
                                    {creator.desc}
                                </p>

                                {creator.links && (
                                    <div className="flex gap-3 justify-center mt-auto">
                                        {creator.links.website && (
                                            <a href={creator.links.website} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#b38b59] hover:bg-[#b38b59] hover:text-white transition-colors" title="Site Web">
                                                <Globe size={16} />
                                            </a>
                                        )}
                                        {creator.links.instagram && (
                                            <a href={creator.links.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#b38b59] hover:bg-[#b38b59] hover:text-white transition-colors" title="Instagram">
                                                <Instagram size={16} />
                                            </a>
                                        )}
                                        {creator.links.facebook && (
                                            <a href={creator.links.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#b38b59] hover:bg-[#b38b59] hover:text-white transition-colors" title="Facebook">
                                                <Facebook size={16} />
                                            </a>
                                        )}
                                        {creator.links.tiktok && (
                                            <a href={creator.links.tiktok} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#f5f1ea] flex items-center justify-center text-[#b38b59] hover:bg-[#b38b59] hover:text-white transition-colors" title="TikTok">
                                                <FaTiktok size={14} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
