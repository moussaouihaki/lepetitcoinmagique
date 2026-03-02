import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// To make this functional in production, you MUST provide STRIPE_SECRET_KEY in your .env.local file.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
    try {
        const { items } = await req.json();

        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn("NO STRIPE_SECRET_KEY FOUND - SIMULATING CHECKOUT (dev only)");
            // Simulated response to show user how it would work when configured
            return NextResponse.json({ url: false });
        }

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'chf',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/cart`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
