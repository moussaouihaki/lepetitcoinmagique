import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
    const {data} = await axios.get('https://www.lepetitcoinmagique.com/product/19404998/laisse-la-magie-de-la-foret-chien-moyen');
    const $ = cheerio.load(data);
    
    // Log meta tags for easy extraction
    console.log("Meta Image:", $('meta[property="og:image"]').attr('content'));
    console.log("Meta Desc:", $('meta[property="og:description"]').attr('content'));
    
    // Try script tags for JSON-LD data
    $('script[type="application/ld+json"]').each((i, el) => {
        try {
            const json = JSON.parse($(el).html());
            if (json['@type'] === 'Product') {
                console.log("JSON-LD Desc:", json.description);
                console.log("JSON-LD Img:", json.image);
            }
        } catch(e) {}
    });
}
test();
