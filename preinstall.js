const   fs = require("fs");

fs.writeFile("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, process.env.GOOGLE_CONFIG, (err) => {});

console.log(require("./google-credentials-heroku.json"));

console.log("preinstall completed successfully with credentials:");