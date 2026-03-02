import Link from 'next/link';

async function getProducts() {
    try {
        const fs = require('fs');
        const path = require('path');
        const p = path.join(process.cwd(), 'data', 'products.json');
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (e) { return []; }
}

async function getOrders() {
    try {
        const fs = require('fs');
        const path = require('path');
        const p = path.join(process.cwd(), 'data', 'orders.json');
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (e) { return []; }
}

export default async function AdminPage() {
    const products = await getProducts();
    const orders = await getOrders();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl font-architects">
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <h1 className="font-cinzel text-5xl text-[#92544e]">Espace Admin</h1>
                <Link href="/" className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300 transition">
                    Retour au site
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Orders Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-2xl mb-6 text-gray-800 flex items-center gap-2">
                        📦 Commandes Récentes
                    </h2>
                    <div className="space-y-4 max-h-[600px] overflow-auto">
                        {orders.length === 0 && <p className="text-gray-500 text-sm">Aucune commande pour le moment...</p>}
                        {orders.map((order: any) => (
                            <div key={order.id} className="border p-4 rounded bg-gray-50 border-gray-200 hover:shadow transition">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono text-sm px-2 py-1 bg-gray-200 rounded text-gray-800">#{order.id}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg">{order.customer}</h3>
                                <p className="text-sm text-gray-600 mb-2">{order.email}</p>

                                <div className="mt-4 pt-3 border-t">
                                    <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Articles ({order.items.length})</h4>
                                    <ul className="space-y-1 mb-3 text-sm">
                                        {order.items.map((item: any, i: number) => (
                                            <li key={i} className="flex justify-between">
                                                <span className="truncate">{item.quantity}x {item.name}</span>
                                                <span className="text-gray-500 whitespace-nowrap ml-2">{(item.price * item.quantity).toFixed(2)} CHF</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex justify-between font-bold text-[#92544e] pt-2 border-t border-dashed">
                                        <span>Total</span>
                                        <span>{order.total.toFixed(2)} CHF</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Products Section */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-2xl mb-6 text-gray-800 flex items-center gap-2">
                        🪄 Gérer les Produits
                    </h2>
                    <div className="max-h-[600px] overflow-auto space-y-4">
                        {products.map((p: any) => (
                            <div key={p.id} className="flex gap-4 p-4 border rounded relative group hover:bg-gray-50 transition border-gray-200">
                                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden shrink-0">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-[#92544e] font-cinzel text-xl">{p.name}</h3>
                                        <span className="font-bold font-mono text-sm bg-gray-100 px-2 rounded border">{p.price.toFixed(2)} CHF</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 mb-1">{p.category}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
