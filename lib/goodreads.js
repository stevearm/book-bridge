const cheerio = require("cheerio");
const rp = require("request-promise")
const keys = require("./keys")

module.exports = {
    listShelves: listShelves
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
