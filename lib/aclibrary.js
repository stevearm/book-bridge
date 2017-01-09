const cheerio = require("cheerio");
const rp = require("request-promise")

module.exports = {
    seed: seed,
    search: search
};

const URL_BASE = "http://encore.aclibrary.org";

function makeRequest(method, url, params) {
    if (method != "GET" && method != "POST") {
        return Promise.reject("Invalid method: " + method);
    }
    return rp({
        method: method,
        uri: url,
        qs: method == "GET" ? params : {},
        form: method == "POST" ? params : {},
        headers: {
            "Cache-Control": "max-age=0",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, sdch",
            "Accept-Language": "en-US,en;q=0.8"
        },
        gzip: true,
        followAllRedirects: true
    })
}

function parseSeed($) {
    var form = $("form#searchFormComponent");
    var url = URL_BASE + form.attr("action");
    var params = form.map(function() {
        var form = $(this);
        var paramsArray = form.find("input[type='hidden']").map(function(){
            var param = $(this);
            return { name: param.attr("name"), value: param.attr("value") };
        }).get();
        return paramsArray.reduce((acc, current) => {
            acc[current.name] = current.value;
            return acc;
        }, {});
    }).get()[0];
    return {
        url: url,
        params: params
    }
}

function seed() {
    return makeRequest("GET", URL_BASE + "/iii/encore/home", { lang: "eng" }).then((html) => {
        return parseSeed(cheerio.load(html));
    });
}

function search(cachedSeed, term) {
    var seedPromise = new Promise(function (resolve, reject) {
        resolve(cachedSeed);
    });
    if (!cachedSeed) {
        // We need to request a seed
        seedPromise = seed();
    }
    return seedPromise.then((seed) => {
        var params = seed.params;
        params["searchString"] = term;
        return makeRequest("POST", seed.url, params).then((html) => {
            var $ = cheerio.load(html);
            var books = $(".searchResult").map(function(){
                var book = $(this);
                var titleNode = book.find(".title > a").first();
                var title = titleNode.text().trim();
                var url = URL_BASE + titleNode.attr("href");
                var type = book.find(".itemMediaDescription").first().text().trim();
                var year = book.find(".itemMediaYear").first().text().trim();
                var availableFullText = book.find(".availabilityMessage").first().text().trim();
                var availableRegex = availableFullText.match(/Available at ([^(]+) \(.*/);
                return {
                    title: title,
                    url: url,
                    type: type,
                    year: year,
                    availableFullText: availableFullText,
                    available: availableRegex ? availableRegex[1] : null
                };
            }).get();
            return {
                books: books,
                seed: parseSeed($)
            };
        });
    });
}
