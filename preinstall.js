const   fs = require("fs");

fs.writeFileSync("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, process.env.GOOGLE_CONFIG);

console.log(require("./lib/config.js")[process.env.NODE_ENV]);