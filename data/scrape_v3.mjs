import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const baseUrl = 'https://www.lepetitcoinmagique.com';

async function fetchHtml(url) {
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        return data;
    } catch (e) {
        return null;
    }
}

async function scrape() {
    console.log("Starting scrape...");
    const html = await fetchHtml(baseUrl);
    if (!html) return;
    const $ = cheerio.load(html);

    // Get category links
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
        console.log("Scraping " + prodLink);
        const pHtml = await fetchHtml(prodLink);
        if (!pHtml) continue;
        const $p = cheerio.load(pHtml);

        const name = $p('h1.jw-product-name').text().trim() || $p('h1').first().text().trim();

        let priceStr = $p('.product__price__price').first().text().trim() || $p('.jw-product-price').first().text().trim();
        let price = 0;
        if (priceStr) price = parseFloat(priceStr.replace(/[^0-9,.]/g, '').replace(',', '.'));

        let description = $p('meta[property="og:description"]').attr('content') || '';
        // Decode HTML entities
        const he = await import('cheerio');
        description = he.load(description).text();

        // Also check if there's a body text
        let pageText = "";
        $p('.jw-product-description, .product-description, .description').each((i, el) => {
            pageText += $p(el).text().trim() + "\n";
        });
        if (pageText.length > description.length) description = pageText.trim();

        // Stock
        let stock = 1;
        if ($p('.product-sticker--sold-out').length > 0) stock = 0;

        // Images 
        const images = new Set();
        let mainImg = $p('meta[property="og:image"]').attr('content');
        if (mainImg) images.add(mainImg.replace(/&amp;/g, '&'));

        $p('img').each((i, el) => {
            let src = $p(el).attr('src') || $p(el).attr('data-src');
            if (src && src.includes('jwwb.nl') && !src.includes('logo') && !src.includes('icon')) {
                src = src.replace('standard', 'high').replace(/&amp;/g, '&');
                images.add(src);
            }
        });

        // Let's also parse JSON-LD
        $p('script[type="application/ld+json"]').each((i, el) => {
            try {
                const jsonObj = JSON.parse($p(el).html());
                if (jsonObj['@type'] === 'Product') {
                    if (jsonObj.image) {
                        const imgArr = Array.isArray(jsonObj.image) ? jsonObj.image : [jsonObj.image];
                        imgArr.forEach(img => images.add(img));
                    }
                    if (jsonObj.description && jsonObj.description.length > description.length) {
                        description = he.load(jsonObj.description).text();
                    }
                }
            } catch (e) { }
        });

        // Let's parse data-webshop-product from the page itself if it exists
        $p('[data-webshop-product]').each((i, el) => {
            try {
                const pd = JSON.parse($p(el).attr('data-webshop-product'));
                if (pd.photo && pd.photo.url) {
                    images.add($p('<div>' + pd.photo.url + '</div>').text()); // decode HTML
                }
            } catch (e) { }
        });

        const imageArray = Array.from(images);

        if (name && (price > 0 || priceStr)) {
            let category = productCategoryMap[prodLink] || 'DIVERS';
            let shippingCost = (category.includes('CHAUDRON') || category.includes('POTERIE') || category.includes('VERRE')) ? 11 : 7.5;

            allProducts.push({
                id: String(idCounter++), name, price: price || 0, description, category,
                stock, image: imageArray[0] || '', images: imageArray,
                is_available: true, shippingCost
            });
        }
    }

    fs.writeFileSync('./data/products_full2.json', JSON.stringify(allProducts, null, 2));
    console.log("Scraped " + allProducts.length + " products completely.");
}

scrape();
