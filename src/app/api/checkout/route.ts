import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Define Stripe conditionally to avoid build-time errors when the key is not present
let stripe: Stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-02-25.clover' as any,
        httpClient: Stripe.createFetchHttpClient(),
    });
}

export async function POST(req: Request) {
    console.log("Stripe Key exists:", !!process.env.STRIPE_SECRET_KEY, "Length:", process.env.STRIPE_SECRET_KEY?.length);

    if (!process.env.STRIPE_SECRET_KEY || !stripe) {
        return NextResponse.json({ error: 'Stripe non configuré (Clé secrète introuvable sur le serveur)' }, { status: 500 });
    }

    try {
        const { items, orderId, customerEmail, shippingCost } = await req.json();

        const origin = req.headers.get('origin') || 'https://le-petit-coin-magique.vercel.app';

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'chf',
                product_data: {
                    name: item.name,
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
                    product_data: { name: 'Frais de port' },
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
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
