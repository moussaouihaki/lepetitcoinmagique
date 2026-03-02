import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const baseUrl = 'https://www.lepetitcoinmagique.com';

async function fetchHtml(url) {
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        return data;
    } catch (e) {
        console.error("Error fetching", url, e.message);
        return null;
    }
}

async function scrape() {
    const html = await fetchHtml(baseUrl);
    if (!html) return;
    const $ = cheerio.load(html);

    // Get category links
    const categoryLinks = new Set();
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('/') && !href.includes('cart') && !href.includes('contact') && !href.includes('livredor') && !href.includes('cgv') && !href.includes('galerie') && !href.includes('product/')) {
            categoryLinks.add(baseUrl + href);
        }
    });

    // Add known categories just in case
    const knownCats = [
        '/les-petits-chaudrons', '/poterie-1', '/forge', '/pyrogravure', '/gravure-sur-verre', '/peinture', '/bijoux', '/les-poilus', '/curiosite'
    ];
    knownCats.forEach(c => categoryLinks.add(baseUrl + c));

    console.log("Found category links:", Array.from(categoryLinks));

    const productLinksSet = new Set();
    const productCategoryMap = {}; // mapping absolute url to category name

    // 1. Find all product Links inside categories
    for (const link of categoryLinks) {
        console.log("Scraping category list:", link);
        const catHtml = await fetchHtml(link);
        if (!catHtml) continue;
        const $cat = cheerio.load(catHtml);

        let customCategory = link.split('/').pop().toUpperCase().replace(/-/g, ' ');
        if (customCategory === '') customCategory = 'ACCUEIL';
        if (customCategory === 'POTERIE 1') customCategory = 'POTERIE';

        // Check for links to products
        $cat('a').each((i, el) => {
            const href = $cat(el).attr('href');
            if (href && href.includes('/product/')) {
                const fullUrl = baseUrl + href;
                productLinksSet.add(fullUrl);
                productCategoryMap[fullUrl] = customCategory;
            }
        });

        // Sometimes products are grouped using data-webshop-product
        $cat('[data-webshop-product]').each((i, el) => {
            try {
                const dataStr = $cat(el).attr('data-webshop-product');
                const data = JSON.parse(dataStr);
                if (data.url) {
                    const fullUrl = baseUrl + data.url.replace(/\\/g, ''); // Fix escape slashes
                    productLinksSet.add(fullUrl);
                    productCategoryMap[fullUrl] = customCategory;
                }
            } catch (e) { }
        });
    }

    console.log(`Found ${productLinksSet.size} potential product links. Now scraping details...`);

    const allProducts = [];
    let idCounter = 1;

    for (const prodLink of productLinksSet) {
        console.log("Scraping product:", prodLink);
        const pHtml = await fetchHtml(prodLink);
        if (!pHtml) continue;
        const $p = cheerio.load(pHtml);

        const name = $p('h1.jw-product-name').text().trim() || $p('h1').first().text().trim();
        const priceText = $p('.product__price__price').first().text().trim() || $p('.jw-product-price').first().text().trim();
        let price = 0;
        if (priceText) {
            price = parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.'));
        }

        // Try multiple selectors for description
        let description = '';
        $p('.jw-product-description, .product__description').find('p, span, div').each((i, el) => {
            const text = $p(el).text().trim();
            if (text) description += text + '\n';
        });
        if (!description) {
            description = $p('.jw-product-description').text().trim() || '';
        }
        description = description.replace(/\n+/g, '\n').trim();

        // Stock tracking
        let stock = 1;
        if ($p('.product-sticker--sold-out').length > 0) {
            stock = 0;
        }

        // Main image
        let imgUrl = $p('.product-image__image--main').attr('src');
        if (imgUrl) {
            // Unescape chars and grab the high res
            imgUrl = imgUrl.replace(/&amp;/g, '&').replace(/&#x3D;/g, '=').replace(/&#x3A;/g, ':').replace(/&#x2F;/g, '/').replace(/&#x3F;/g, '?');
            imgUrl = imgUrl.replace('standard', 'high'); // Get better quality if possible
        }

        if (name && priceText) {
            allProducts.push({
                id: String(idCounter++),
                name,
                price: price || 0,
                description,
                category: productCategoryMap[prodLink] || 'DIVERS',
                stock,
                image: imgUrl || '',
                is_available: true,
                shippingCost: customShippingCostForCategory(productCategoryMap[prodLink] || '')
            });
        }
    }

    fs.writeFileSync('./data/products_full.json', JSON.stringify(allProducts, null, 2));
    console.log(`Saved ${allProducts.length} full products to data/products_full.json`);
}

function customShippingCostForCategory(category) {
    if (category.includes('CHAUDRON') || category.includes('POTERIE') || category.includes('VERRE')) {
        return 11;
    }
    return 7.5;
}

scrape();
