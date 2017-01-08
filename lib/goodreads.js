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
    }).then((list) => {
        return list;
    }).catch((err) => console.log("Error", err));
}
