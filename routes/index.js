const   express     = require("express");

const   ss          = require("../lib/spreadsheet.js");
const   formData    = require("../lib/form-options.js");
const   org         = require("./services/org.js");

const   router      = express.Router({mergeParams: true});

// show form
router.get("/", function(req, res){
    if (req.params.orgId === "kapiti" || req.params.orgId === "wellington") {
        if (!req.query.data) {
            res.render("forms", {businessName: req.params.orgId})
        } else {
            org.getData(req.params.orgId)
                .then(function(result){
                    res.send(result);
                })
                .catch(function(err){
                    console.error("Error in show form route org.getData");
                    console.error(err);
                });
        };
    } else {
        res.status(404).send("Not found");
    }
    
});

module.exports = router;