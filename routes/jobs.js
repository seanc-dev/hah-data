const   express = require("express");

const   ss      = require("../lib/spreadsheet.js");

const   router  = express.Router({mergeParams: true});

// create route
router.post("/", (req, res) => {
    console.log(req.body);
})

module.exports = router;