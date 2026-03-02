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

    const productLinksSet = new Set();
    const productCategoryMap = {};

    for (const link of categoryLinks) {
        const catHtml = await fetchHtml(link);
        if (!catHtml) continue;
        const $cat = cheerio.load(catHtml);

        let customCategory = link.split('/').pop().toUpperCase().replace(/-/g, ' ');
        if (customCategory === '') customCategory = 'ACCUEIL';
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
                const dataStr = $cat(el).attr('data-webshop-product');
                const data = JSON.parse(dataStr);
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
        console.log("Scraping product:", prodLink);
        const pHtml = await fetchHtml(prodLink);
        if (!pHtml) continue;
        const $p = cheerio.load(pHtml);

        const name = $p('h1.jw-product-name').text().trim() || $p('h1').first().text().trim() || $p('meta[property="og:title"]').attr('content');

        const priceText = $p('.product__price__price').first().text().trim() || $p('.jw-product-price').first().text().trim();
        let price = 0;
        if (priceText) {
            price = parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.'));
        }

        // Better Description extraction
        let description = $p('meta[property="og:description"]').attr('content') || $p('meta[name="description"]').attr('content') || '';
        // Decode HTML entities like &eacute; -> é
        const he = await import('cheerio');
        description = he.load(description).text();

        // Stock tracking
        let stock = 1;
        if ($p('.product-sticker--sold-out').length > 0) {
            stock = 0;
        }

        // Images extraction
        let mainImg = $p('meta[property="og:image"]').attr('content');
        if (mainImg) {
            mainImg = mainImg.replace(/&amp;/g, '&').replace(/&#x3D;/g, '=').replace(/&#x3F;/g, '?');
        }

        const images = new Set();
        if (mainImg) images.add(mainImg);

        // Add other images found
        $p('img').each((i, el) => {
            let src = $p(el).attr('src') || $p(el).attr('data-src');
            if (src && src.includes('.jwwb.nl/public') && !src.includes('fb_img') && !src.includes('logo')) {
                src = src.replace(/&amp;/g, '&').replace(/&#x3D;/g, '=').replace(/&#x3F;/g, '?');
                // Optional: try to get highest res by modifying standard to high
                src = src.replace('standard', 'high');
                images.add(src);
            }
        });

        const imageArray = Array.from(images);

        if (name && (price > 0 || priceText)) {
            allProducts.push({
                id: String(idCounter++),
                name,
                price: price || 0,
                description,
                category: productCategoryMap[prodLink] || 'DIVERS',
                stock,
                image: imageArray[0] || '',
                images: imageArray, // added images array
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
