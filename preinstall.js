// const   fs = require("fs");

// fs.writeFile("./google-credentials-heroku.json", process.env.GOOGLE_CONFIG, (err) => {});

// console.log("preinstall completed successfully with credentials:");

// fs.readFile("./google-credentials-heroku.json", function(file){
//     console.log(file);
// });


if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {

    console.log("NODE_ENV === development");

} else {

    console.log("NODE_ENV !== development");

}