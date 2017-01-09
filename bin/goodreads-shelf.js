const goodreads = require("../lib/goodreads")

if (process.argv.length < 4) {
    console.log("Must supply a user-id and shelf name");
    return;
}

var userId = process.argv[2];
var shelfName = process.argv[3];

goodreads.listShelf(userId, shelfName).then((list) => {
    console.log("Got the user %s shelf %s", userId, shelfName, list);
});
