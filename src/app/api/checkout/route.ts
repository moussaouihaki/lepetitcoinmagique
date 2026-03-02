import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            // No key configured: simulate success (redirect to success page)
            return NextResponse.json({ url: null });
        }

        const { items, orderId, customerEmail } = await req.json();
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
