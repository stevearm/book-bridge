const fs = require('fs');

module.exports = readKeys;

/*
 * Expect a json file with the following schema
 *
 * { key: "my GoodReads API key", secret: "my GoodReads API secret" }
 */
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
