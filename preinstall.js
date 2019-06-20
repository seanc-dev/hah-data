const   fs = require("fs");



// fs.writeFile("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, process.env.GOOGLE_CONFIG, (err) => {});
// fs.writeFile("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, process.env.GOOGLE_CONFIG, (err) => {});

// fs.readFile("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, function(file){
//     console.log("preinstall fs.readFile callback credentials file");
//     console.log(file);
// });

console.log("./" + GOOGLE_CREDENTIALS_LOCATION);
console.log(require("./" + process.env.GOOGLE_CREDENTIALS_LOCATION));

console.log("preinstall completed successfully with credentials:");

