import { NextResponse } from 'next/server';
export async function GET() {
    return NextResponse.json({
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        keyStart: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 10) : 'none'
    });
}
