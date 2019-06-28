const   express     = require("express");

const   ss          = require("../lib/spreadsheet.js");
const   formData    = require("../lib/form-options.js");
const   org         = require("./services/org.js");

const   router      = express.Router({mergeParams: true});

// show form
router.get("/", function(req, res){
    let orgId = req.params.orgId
    if (orgId === "kapiti" || orgId === "wellington") {
        if (!req.query.data) {
            res.render("forms", {
                businessName: orgId,
                businessNameDisplay: orgId[0].toUpperCase() + orgId.slice(1)
            });
        } else {
            org.getData(orgId)
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