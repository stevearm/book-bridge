const aclibrary = require("../lib/aclibrary")

if (process.argv.length < 3) {
    console.log("Must supply at least one search term");
    return;
}

var searchTerms = process.argv.slice(2);

if (searchTerms.length > 1) {
    console.log("For now only handling one search term");
    return;
}

aclibrary.seed().then((seed) => {
    // For now, only handle the first search
    return aclibrary.search(seed, searchTerms[0]);
}).then((result) => {
    var availableLocations = result.books.map((x) => x.available).filter((x) => x);
    console.log("Got %s books with %s available", result.books.length, availableLocations.length);
    console.log(availableLocations);
}).catch((err) => console.log("Something wrong", err));
