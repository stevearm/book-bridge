const fs = require('fs');
const rp = require("request-promise")

function readKeys() {
	return new Promise(function (resolve, reject) {
        fs.readFile(__dirname + "/../data/keys.json", function (error, data) {
            if (error) {
                console.log(error);
                return reject(error);
            }

            var keys = JSON.parse(data);
            resolve(keys);
        });
    });
}

function listShelves(userId) {
    return readKeys().then((keys) => {
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

if (process.argv.length < 3) {
    console.log("Must supply a user-id");
    return;
}

var userId = process.argv[2];

listShelves(userId).then((list) => {
    console.log("Final output is", list);
});
