const aclibrary = require("../lib/aclibrary")

if (process.argv.length < 3) {
    console.log("Must supply at least one search term");
    return;
}

var searchTerms = process.argv.slice(2);

aclibrary.search(null, searchTerms).then((result) => {
    for (var bookName in result.results) {
        var availableLocations = result.results[bookName].map((x) => x.available).filter((x) => x);
        console.log("For '%s' got %s books with %s available", bookName, result.results[bookName].length, availableLocations.length);
        console.log(availableLocations);
        console.log("");
    }
}).catch((err) => console.log("Something wrong", err));
