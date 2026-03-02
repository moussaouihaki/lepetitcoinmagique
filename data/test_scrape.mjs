import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
    try {
        const { data } = await axios.get('https://www.lepetitcoinmagique.com/product/19404998/laisse-la-magie-de-la-foret-chien-moyen');
        const $ = cheerio.load(data);

        console.log("Title:");
        console.log($('h1').text());

        console.log("\nMeta Image:", $('meta[property="og:image"]').attr('content'));
        console.log("Meta Desc:", $('meta[property="og:description"]').attr('content'));

        console.log("\nImages:");
        $('img').each((i, el) => {
            console.log($(el).attr('src'));
        });

        console.log("\nDescription Text from generic divs:");
        $('div.product-description, div.description').each((i, el) => {
            console.log($(el).text().trim());
        });

        console.log("\nJSON-LD:");
        $('script[type="application/ld+json"]').each((i, el) => {
            try {
                const json = JSON.parse($(el).html());
                console.log(JSON.stringify(json, null, 2));
            } catch (e) { }
        });

        console.log("\nWindow config:");
        $('script').each((i, el) => {
            const html = $(el).html() || '';
            if (html.includes('window.product')) {
                console.log(html.substring(0, 500));
            }
        });
    } catch (e) {
        console.error(e);
    }
}
test();
