const express = require("express");

const lib = require("../lib/library.js"),
    ss = require("../lib/spreadsheet.js"),
    Client = require("../lib/classes/client.js"),
    geocodeAddress = require("./services/geocode.js"),
    getData = require('./services/getData.js');

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
        getData.getAddressString(req)
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
        getData.getKeys(client, req, res)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
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
                res.status(500).send(new Error(errorMessage));
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
                getData.dataObjInit(client, "new", "create")
                .then(result => res.send(result))
                .catch(err => {
                    console.error("Error in client create route dataObjInit");
                    console.error(err);
                    res.status(500).send(err)
                });

            })
            .catch((err) => {

                console.error("Failed to geocode Client's Billing Address");
                console.error(err);
                
                let client = new Client(req.params.orgId, false, req.body);
                getData.dataObjInit(client, "new", "create")
                .then(result => res.send(result))
                .catch(err => {
                    console.error("Error in client create route dataObjInit");
                    console.error(err);
                    res.status(500).send(err)
                });

            });

        })
        .catch(function(err){
            console.error(err);
            res.status(500).send(err);
        });

});

// show
router.get("/:id", (req, res) => {

    let client = new Client(req.params.orgId, req.params.id, false);
    getData.dataObjInit(client, "view", "show")
        .then((result) => {
            res.send(result);
            console.log("Retrieved details for client with id " + req.params.id);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });

});

// update
router.put("/:id", (req, res) => {

    let client = new Client(req.params.orgId, req.params.id, req.body);
    getData.dataObjInit(client, "edit", "update")
        .then((result) => {
            console.log("Updated details for client with id " + req.params.id);
            res.send(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });

});

// destroy
router.delete("/:id", (req, res) => {

    let client = new Client(req.params.orgId, req.params.id, req.body, "");
    getData.dataObjInit(client, "delete", "destroy")
        .then((result) => {
            console.log("Deleted details for client with id " + req.params.id);
            res.send(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });

});

module.exports = router;