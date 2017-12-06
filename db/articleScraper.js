// Dependencies
// =============================================================
const request = require('request');
const cheerio = require('cheerio');

exports.articleScraper = () => {
    return new Promise((resolve, reject) => {

        let url = "http://lifehacker.com/"

        request(url, (err, res, body) => {
            if (err) {
                reject(err);
            }

            let $ = cheerio.load(body);
            let parsedResults = [];

            $('h1 .js_entry-link').each(function (i, ele) {
                let title = $(this).text();
                let pubTime = $(this).parent().parent().children('.meta--pe').children('.meta__container').children('time').attr('datetime');
                let url = $(this).attr('href');
                let img = $(this).parent().parent().next().find('img').prev().attr('data-srcset');
                let blurb = $(this).parent().parent().next().children('div').children('p').text();
                let category = $(this).parent().parent().parent().find(".meta__text").text();
                let author = $(this).parent().next().children().children(".author").text()

                let article = {
                    title: title,
                    pubDate: pubTime,
                    url: url,
                    img: img,
                    blurb: blurb,
                    category: category,
                    author:author
                }
                parsedResults.push(article);
            })
            console.log('articles parsed');
            resolve(parsedResults);
        })
    })
}

