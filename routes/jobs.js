const   express = require("express");

const   Job     = require("../lib/classes/job.js"),
        geocode = require("./services/geocode.js"),
        ss      = require("../lib/spreadsheet.js");

const   router  = express.Router({mergeParams: true});

// create route
router.post("/", (req, res) => {

    let location = req.body.workLocationStreet + " " + req.body.workLocationSuburb + " " + req.body.workLocationCity + " " + req.body.workLocationPostcode

    geocode(location)
    .then(function(result){
        console.log(result);
        req.body.workLocationLatitude = result[0].latitude
        req.body.workLocationLongitude = result[0].longitude
        req.body.workLocationFormattedAddress = result[0].formattedAddress
        req.body.workLocationGPID = result[0].extra.googlePlaceId
        new Job(req.params.orgId, false, req.body);
        res.redirect("/" + req.params.orgId);
    })
    .catch((err) => {
        console.error("Failed to geocode Client's Billing Address");
        console.error(err);
        new Job(req.params.orgId, false, req.body);
        res.redirect("/" + req.params.orgId);
    });

})

module.exports = router;