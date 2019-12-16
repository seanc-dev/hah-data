const express = require("express");

const Job = require("../lib/classes/job.js"),
    lib = require("../lib/library.js"),
    geocode = require("./services/geocode.js"),
    ss = require("../lib/spreadsheet.js");

const config = require("../lib/config.js");

const router = express.Router({
    mergeParams: true
});

// index route
router.get("/", (req, res) => {
    if (req.query.requestType === "detailsArray") {
        ss.getJobDetailsArray(req.params.orgId)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.error("Failed to retrieve job details array");
                console.error(err);
                res.status(500).send(err);
            });
    } else if (req.query.requestType === 'keys') {
        let job = new Job(req.params.orgId, 1, false);
        job.init("view")
            .then((result) => {
                // get keys for job record (fieldnames)
                let keysArr = Object.keys(result);
                let fieldLabels = [];
                // map in labels from fieldnames and send to client
                for (i = 0; i < keysArr.length; i++) {
                    fieldLabels[i] = lib.getFieldLabelFromName(require("../lib/mapping.js")[req.params.orgId]["job"], keysArr[i]);
                }
                return res.send({fieldLabels: fieldLabels, fieldNames: keysArr});
            })
            .catch((err) => {
                console.error("Failed to retrieve db record keys in jobs index route: keys");
                console.error(err);
                res.status(500).send(err);
            });
    }
});

// create route
router.post("/", (req, res) => {

    let location = req.body.workLocationStreet + " " + req.body.workLocationSuburb + " " + req.body.workLocationCity + " " + req.body.workLocationPostcode

    geocode(location)
        .then(function (result) {

            console.log(result);

            req.body.workLocationLatitude = result[0].latitude
            req.body.workLocationLongitude = result[0].longitude
            req.body.workLocationFormattedAddress = result[0].formattedAddress
            req.body.workLocationGPID = result[0].extra.googlePlaceId

            let job = new Job(req.params.orgId, false, req.body);
            dataObjInit(job, "new", "create", req, res);

        })
        .catch((err) => {

            console.error("Failed to geocode Billing Address for job " + req.body.jobId);
            console.error(err);

            let job = new Job(req.params.orgId, false, req.body);
            dataObjInit(job, "new", "create", req, res);

        });

});

// show
router.get("/:id", (req, res) => {

    job = new Job(req.params.orgId, req.params.id, false);
    dataObjInit(job, "view", "show", req, res)
        .then((result) => {
            console.log("Retrieved details for job with id " + req.params.id);
        })
        .catch(console.error);

});

// update
router.put("/:id", (req, res) => {

    job = new Job(req.params.orgId, req.params.id, false);
    dataObjInit(job, "edit", "update", req, res)
        .then((result) => {
            console.log("Updated details for job with id " + req.params.id);
        })
        .catch(console.error);

});

// destroy
router.delete("/:id", (req, res) => {

    new Job(req.params.orgId, req.params.id, req.body);
    dataObjInit(job, "delete", "destroy", req, res)
        .then((result) => {
            console.log("Deleted details for job with id " + req.params.id);
        })
        .catch(console.error);

});

module.exports = router;

module.exports = router;