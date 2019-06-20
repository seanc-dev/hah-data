const   express = require("express");

const   Job     = require("../lib/classes/job.js"),
        ss      = require("../lib/spreadsheet.js");

const   router  = express.Router({mergeParams: true});

// create route
router.post("/", (req, res) => {
    new Job(req.params.orgId, false, req.body);
    res.redirect("/" + req.params.orgId);
})

module.exports = router;