import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Provide a fallback dummy key to prevent Stripe from crashing during Vercel's build phase module evaluation
const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_to_pass_build';
const stripe = new Stripe(stripeSecret, {
    apiVersion: '2026-02-25.clover' as any,
    httpClient: Stripe.createFetchHttpClient(),
});

export async function POST(req: Request) {
    console.log("Stripe Key exists:", !!process.env.STRIPE_SECRET_KEY, "Length:", process.env.STRIPE_SECRET_KEY?.length);

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_dummy_key_to_pass_build') {
        return NextResponse.json({ error: 'Stripe non configuré (Clé secrète introuvable sur le serveur)' }, { status: 500 });
    }

    try {
        const { items, orderId, customerEmail, shippingCost } = await req.json();

        const origin = req.headers.get('origin') || 'https://lepetitcoinmagique.ch';

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'chf',
                product_data: {
                    name: item.name,
                    description: item.description || '',
                    ...(item.image ? { images: [item.image] } : {}),
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Add shipping as a line item if > 0
        if (shippingCost && shippingCost > 0) {
            lineItems.push({
                price_data: {
                    currency: 'chf',
                    product_data: {
                        name: 'Frais de port',
                        description: 'Livraison sécurisée sous 2 jours ouvrés'
                    },
                    unit_amount: Math.round(shippingCost * 100),
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerEmail || undefined,
            success_url: `${origin}/checkout/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout`,
            metadata: { orderId: orderId || '' },
            allow_promotion_codes: true, // Permet d'ajouter des codes promo sur la gauche
            custom_text: {
                shipping_address: {
                    message: "Votre commande sera préparée avec soin dans notre atelier du Jura."
                },
                submit: {
                    message: "Paiement sécurisé crypté SSL"
                }
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
