import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const baseUrl = 'https://www.lepetitcoinmagique.com';

async function fetchHtml(url) {
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 });
        return data;
    } catch (e) {
        return null;
    }
}

async function scrape() {
    console.log("Starting ULTRA deep scrape (Strict Image Filtering)...");
    const html = await fetchHtml(baseUrl);
    if (!html) return;
    const $ = cheerio.load(html);

    const categoryLinks = new Set([
        baseUrl + '/les-petits-chaudrons', baseUrl + '/poterie-1', baseUrl + '/forge',
        baseUrl + '/pyrogravure', baseUrl + '/gravure-sur-verre', baseUrl + '/peinture',
        baseUrl + '/bijoux', baseUrl + '/les-poilus', baseUrl + '/curiosite'
    ]);

    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.startsWith('/') && !href.includes('cart') && !href.includes('product/')) {
            categoryLinks.add(baseUrl + href);
        }
    });

    const productLinksSet = new Set();
    const productCategoryMap = {};

    for (const link of categoryLinks) {
        const catHtml = await fetchHtml(link);
        if (!catHtml) continue;
        const $cat = cheerio.load(catHtml);

        let customCategory = link.split('/').pop().toUpperCase().replace(/-/g, ' ');
        if (customCategory === 'POTERIE 1') customCategory = 'POTERIE';

        $cat('a').each((i, el) => {
            const href = $cat(el).attr('href');
            if (href && href.includes('/product/')) {
                const fullUrl = baseUrl + href;
                productLinksSet.add(fullUrl);
                productCategoryMap[fullUrl] = customCategory;
            }
        });

        $cat('[data-webshop-product]').each((i, el) => {
            try {
                const data = JSON.parse($cat(el).attr('data-webshop-product'));
                if (data.url) {
                    const fullUrl = baseUrl + data.url.replace(/\\/g, '');
                    productLinksSet.add(fullUrl);
                    productCategoryMap[fullUrl] = customCategory;
                }
            } catch (e) { }
        });
    }

    const allProducts = [];
    let idCounter = 1;

    for (const prodLink of productLinksSet) {
        console.log(`Analyzing: ${prodLink}`);
        const pHtml = await fetchHtml(prodLink);
        if (!pHtml) continue;
        const $p = cheerio.load(pHtml);

        const name = $p('h1.jw-product-name').text().trim() || $p('h1').first().text().trim() || $p('meta[property="og:title"]').attr('content');

        let priceStr = $p('.product__price__price').first().text().trim() || $p('.jw-product-price').first().text().trim();
        let price = 0;
        if (priceStr) price = parseFloat(priceStr.replace(/[^0-9,.]/g, '').replace(',', '.'));

        let description = "";

        // Try to get description from the main content area primarily
        const descArea = $p('.jw-product-description, .product__description, div[itemprop="description"]').first();
        if (descArea.length) {
            description = descArea.text().trim();
        }

        // Fallback to JSON-LD if content area is thin
        $p('script[type="application/ld+json"]').each((i, el) => {
            try {
                const ld = JSON.parse($p(el).html());
                if (ld['@type'] === 'Product' && ld.description) {
                    if (ld.description.length > description.length) description = ld.description;
                }
            } catch (e) { }
        });

        const ogDesc = $p('meta[property="og:description"]').attr('content');
        if (ogDesc && ogDesc.length > description.length) description = ogDesc;

        const he = await import('cheerio');
        description = he.load(description).text().trim();

        // STRICT IMAGE FILTERING
        const images = new Set();

        // 1. Target the product gallery specifically
        $p('.jw-product-container img, .product-detail img, .product__images img, [data-webshop-product] img').each((i, el) => {
            let src = $p(el).attr('src') || $p(el).attr('data-src');
            if (src && src.includes('jwwb.nl/public')) {
                // Ignore obvious logos/icons or tiny images
                const isLogo = src.toLowerCase().includes('logo') || src.toLowerCase().includes('fb_img_1747862163342'); // That FB image seems to be a logo/default
                if (!isLogo && !src.includes('icon') && !src.includes('badge')) {
                    src = src.replace('standard', 'high').replace(/&amp;/g, '&');
                    images.add(src);
                }
            }
        });

        // 2. Fallback to meta image IF it's not the logo
        let metaImg = $p('meta[property="og:image"]').attr('content');
        if (metaImg && !metaImg.includes('fb_img_1747862163342') && !metaImg.toLowerCase().includes('logo')) {
            images.add(metaImg.replace(/&amp;/g, '&'));
        }

        const imageArray = Array.from(images);
        const category = productCategoryMap[prodLink] || 'DIVERS';
        const shippingCost = (category.includes('CHAUDRON') || category.includes('POTERIE') || category.includes('VERRE')) ? 11 : 7.5;
        const stock = $p('.product-sticker--sold-out').length > 0 ? 0 : 1;

        if (name && (price > 0 || priceStr)) {
            allProducts.push({
                idx: idCounter++,
                name, price: price || 0, description, category,
                stock, image: imageArray[0] || '', images: imageArray,
                is_available: true, shippingCost, originalUrl: prodLink
            });
        }
    }

    fs.writeFileSync('./data/products_final.json', JSON.stringify(allProducts, null, 2));
    console.log(`Success! ${allProducts.length} products scraped. JSON saved to data/products_final.json`);
}

scrape();
