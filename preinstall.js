const   fs = require("fs");

fs.writeFile("./google-credentials-heroku.json", process.env.GOOGLE_CONFIG, (err) => {});

console.log("preinstall completed successfully with credentials:");

console.log(fs.readFile("./google-credentials-heroku.json"));