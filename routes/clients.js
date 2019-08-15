const   express = require("express");

const   mapping = require("../lib/mapping.js"),
        ss      = require("../lib/spreadsheet.js"),
        Client  = require("../lib/classes/client.js"),
        geocode = require("./services/geocode.js");

const   router  = express.Router({mergeParams: true});

// index route
router.get("/", (req, res) => {
    if(req.query.requestType === "clients") {
        let clientsArr = ss.getClientDetailsArray(req.params.orgId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients array");
                console.error(err);
                res.send(err);
            });
    } else if(req.query.requestType === "clientAddress") {
        ss.getAddressDetailsArray(req.params.orgId, req.query.clientId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients address");
                console.error(err);
                res.send(err);
            });
    }
});

// create route
router.post("/", (req, res) => {

    // let location = req.body.billingAddressStreet + " " + req.body.billingAddressSuburb + " " + req.body.billingAddressCity + " " + req.body.billingAddressPostcode
    // console.log(location);
    // geocode(location)
    // .then(function(result){
        // console.log(result);
        new Client(req.params.orgId, false, req.body);
        res.redirect("/" + req.params.orgId);
    // })
    // .catch((err) => {
    //     console.error("Failed to geocode Client's Billing Address");
    //     console.error(err);
    //     res.send("err");
    // });

});

module.exports = router;