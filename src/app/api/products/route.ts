export async function GET() {
    try {
        const fs = require('fs');
        const path = require('path');
        const productsPath = path.join(process.cwd(), 'data', 'products.json');
        const fileContents = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(fileContents);
        return Response.json(products);
    } catch (error) {
        return Response.json({ error: 'Failed to load products' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const fs = require('fs');
        const path = require('path');
        const productsPath = path.join(process.cwd(), 'data', 'products.json');
        const fileContents = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(fileContents);

        const newProduct = {
            id: Date.now().toString(),
            ...data
        };

        products.push(newProduct);
        fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

        return Response.json(newProduct, { status: 201 });
    } catch (error) {
        return Response.json({ error: 'Failed to save product' }, { status: 500 });
    }
}
