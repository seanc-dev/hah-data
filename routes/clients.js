const express = require("express");

const mapping = require("../lib/mapping.js"),
    ss = require("../lib/spreadsheet.js"),
    Client = require("../lib/classes/client.js"),
    geocodeAddress = require("./services/geocode.js");

const router = express.Router({
    mergeParams: true
});

// index route
router.get("/", (req, res) => {
    if (req.query.requestType === "clients") {
        ss.getClientDetailsArray(req.params.orgId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients array");
                console.error(err);
                res.send(err);
            });
    } else if (req.query.requestType === "clientAddress") {
        ss.getAddressDetailsString(req.params.orgId, req.query.clientId)
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

    let location = req.body.billingAddressStreet + " " + req.body.billingAddressSuburb + " " + req.body.billingAddressCity + " " + req.body.billingAddressPostcode

    ss.getClientDetailsArray(req.params.orgId)
        .then((result) => { // test for account name similarity

            if (result.find((el) => {el.accountName === req.body.accountName})) {

                let errorMessage = "Client record with that account name already exists in database";
                console.error(errorMessage);
                res.send(new Error(errorMessage));

            }

        })
        // .then((result) => {this is where I would add the test for address similarity if requested (note - should be replaced by db keys later)})
        .catch((error) => {

            console.error(error);
            res.send(new Error("Failed to check entered record against existing Client database"));

        })
        .then((result) => {

            geocodeAddress(location)
            .then(function (result) {

                req.body.billingAddressLatitude = result[0].latitude
                req.body.billingAddressLongitude = result[0].longitude
                req.body.billingAddressFormatted = result[0].formattedAddress
                req.body.billingAddressGPID = result[0].extra.googlePlaceId

                let client = new Client(req.params.orgId, false, req.body);
                res.send({id: client._id});

            })
            .catch((err) => {

                console.error("Failed to geocode Client's Billing Address");
                console.error(err);

                let client = new Client(req.params.orgId, false, req.body);

                res.send({id: client._id});

            });

        })

});

module.exports = router;