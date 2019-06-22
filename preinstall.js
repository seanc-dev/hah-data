const   fs = require("fs");

fs.writeFile("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, process.env.GOOGLE_CONFIG, (err) => {

    if (err) console.error(err);
    
    console.log("preinstall completed successfully with credentials:");

});

