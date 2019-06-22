const   fs = require("fs");

fs.writeFile("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, process.env.GOOGLE_CONFIG, (err) => {

    if (err) console.error(err);
    
    console.log("preinstall completed successfully with credentials:");

    fs.readFile("./" + process.env.GOOGLE_CREDENTIALS_LOCATION, function(err, file){

        if (err) console.error(err);

        console.log(file);

    })

});

