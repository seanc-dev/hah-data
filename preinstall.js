const   fs = require("fs");

fs.writeFile("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, process.env.GOOGLE_CONFIG, (err) => {});

console.log("preinstall completed successfully with credentials:");

console.log(require("./google-credentials-heroku.json"));