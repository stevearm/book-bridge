const goodreads = require("../lib/goodreads")

if (process.argv.length < 3) {
    console.log("Must supply a user-id");
    return;
}

var userId = process.argv[2];

goodreads.listShelves(userId).then((list) => {
    console.log("Final output is", list);
});
