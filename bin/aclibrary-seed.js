const aclibrary = require("../lib/aclibrary")

aclibrary.seed().then((seed) => {
    console.log("Got bootstrap seed", seed);
}).catch((err) => console.log("Something wrong", err));
