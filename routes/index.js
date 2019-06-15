const   express     = require("express");

const   ss          = require("../lib/spreadsheet.js");
const   formData    = require("../lib/form-options.js");

const   router      = express.Router({mergeParams: true});

// show forms
router.get("/", function(req, res){
    if (req.params.orgId === "kapiti" || req.params.orgId === "wellington") {
        if (!req.query.data) {
            res.render("forms", {businessName: req.params.orgId})
        } else {
            res.send({data: formData[req.params.orgId], businessName: req.params.orgId});
        };
    } else {
        res.status(404).send("Not found");
    }
    
});

module.exports = router;