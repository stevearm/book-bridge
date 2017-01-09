const cheerio = require("cheerio");
const rp = require("request-promise")
const keys = require("./keys")

module.exports = {
    listShelves: listShelves,
    listShelf: listShelf
};

function listShelves(userId) {
    return keys().then((keys) => {
        return rp({
            method: "GET",
            uri: "https://www.goodreads.com/shelf/list.xml",
            qs: {
                key: keys.key,
                user_id: userId
            }
        });
    }).then((listXml) => {
        var $ = cheerio.load(listXml);
        return $("user_shelf").map(function () {
            var node = $(this);
            return {
                id: node.find("id").text(),
                name: node.find("name").text(),
                bookCount: node.find("book_count").text()
            };
        }).get();
    }).catch((err) => console.log("Error", err));
}

/*
 * Using the publicly accessible shelf-list page because I can't find an api endpoint that will list books on a shelf
 */
function listShelf(userId, shelfName) {
    return rp({
        method: "GET",
        uri: "https://www.goodreads.com/review/list/" + userId,
        qs: {
            shelf: shelfName
        }
    }).then((listHtml) => {
        var intOrMinusOne = function(stringNumber) {
            var number = parseInt(stringNumber);
            if (isNaN(number)) {
                return -1;
            }
            return number;
        };
        var $ = cheerio.load(listHtml);
        return $("tr.bookalike.review").map(function() {
            var node = $(this);
            return {
                name: node.find(".field.title > div.value > a").text().trim().split("\n")[0],
                author: node.find(".field.author > div.value > a").text().trim(),
                isbn: intOrMinusOne(node.find(".field.isbn > .value").text()),
                isbn13: intOrMinusOne(node.find(".field.isbn13 > .value").text()),
                asin: intOrMinusOne(node.find(".field.asin > .value").text())
            };
        }).get();
    }).catch((err) => console.log("Unable to list user %s shelf %s", userId, shelfName, err));
}
