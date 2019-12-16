const express = require("express");

const lib = require("../lib/library.js"),
    ss = require("../lib/spreadsheet.js"),
    Client = require("../lib/classes/client.js"),
    geocodeAddress = require("./services/geocode.js"),
    dataObjInit = require("./services/index.js").dataObjInit;

const config = require("../lib/config.js");

const router = express.Router({
    mergeParams: true
});

// index route
router.get("/", (req, res) => {
    if (req.query.requestType === "detailsArray") {
        ss.getClientDetailsArray(req.params.orgId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients array");
                console.error(err);
                res.status(500).send(err);
            });
    } else if (req.query.requestType === "address") {
        ss.getAddressDetailsString(req.params.orgId, req.query.clientId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve clients address");
                console.error(err);
                res.status(500).send(err);
            });
    } else if (req.query.requestType === 'keys') {
        let client = new Client(req.params.orgId, 1, false);
        client.init("view")
            .then((result) => {
                // get keys for client record (fieldnames)
                let keysArr = Object.keys(result);
                let fieldLabels = [];
                // map in labels from fieldnames and send to client
                for (i = 0; i < keysArr.length; i++) {
                    fieldLabels[i] = lib.getFieldLabelFromName(require("../lib/mapping.js")[req.params.orgId]["client"], keysArr[i]);
                }
                return res.send({fieldLabels: fieldLabels, fieldNames: keysArr});
            })
                .catch((err) => {
                    console.error("Failed to retrieve db record keys in clients index route: keys");
                    console.error(err);
                    res.status(500).send(err);
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
            console.error(error)
            console.error("Error in client create route: Failed to get client details array from DB")
        })
        .then((result) => {

            geocodeAddress(location)
            .then(function (result) {

                req.body.billingAddressLatitude = result[0].latitude
                req.body.billingAddressLongitude = result[0].longitude
                req.body.billingAddressFormatted = result[0].formattedAddress
                req.body.billingAddressGPID = result[0].extra.googlePlaceId

                let client = new Client(req.params.orgId, false, req.body);
                dataObjInit(client, "new", "create", req, res);

            })
            .catch((err) => {

                console.error("Failed to geocode Client's Billing Address");
                console.error(err);
                
                let client = new Client(req.params.orgId, false, req.body);
                dataObjInit(client, "new", "create", req, res);

            });

        })
        .catch(function(err){
            console.error(err);
            res.send(err);
        });

});

// show
router.get("/:id", (req, res) => {

    client = new Client(req.params.orgId, req.params.id, false);
    dataObjInit(client, "view", "show", req, res)
        .then((result) => {
            console.log("Retrieved details for client with id " + req.params.id);
        })
        .catch(console.error);

});

// update
router.put("/:id", (req, res) => {

    new Client(req.params.orgId, req.params.id, req.body);
    dataObjInit(client, "edit", "update", req, res)
        .then((result) => {
            console.log("Updated details for client with id " + req.params.id);
        })
        .catch(console.error);

});

// destroy
router.delete("/:id", (req, res) => {

    new Client(req.params.orgId, req.params.id, req.body, "");
    dataObjInit(client, "delete", "destroy", req, res)
        .then((result) => {
            console.log("Deleted details for client with id " + req.params.id);
        })
        .catch(console.error);

});

module.exports = router;