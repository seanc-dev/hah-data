const   fs = require("fs");

console.log(process.env.GOOGLE_CONFIG);

fs.writeFile("./google-credentials-heroku.json", process.env.GOOGLE_CONFIG, (err) => {});