const express = require("express");

const Job = require("../lib/classes/job.js"),
    lib = require("../lib/library.js"),
    geocode = require("./services/geocode.js"),
    ss = require("../lib/spreadsheet.js"),
    getData = require("./services/getData.js");

const config = require("../lib/config.js");

const router = express.Router({
    mergeParams: true
});

// index route
router.get("/", (req, res) => {
    if (req.query.requestType === "detailsArray") {
        getData.getJobDetailsArray(req)
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
        getData.getKeys(job, req, res)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
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

            req.body.workLocationLatitude = result[0].latitude
            req.body.workLocationLongitude = result[0].longitude
            req.body.workLocationFormattedAddress = result[0].formattedAddress
            req.body.workLocationGPID = result[0].extra.googlePlaceId

            let job = new Job(req.params.orgId, false, req.body);
            getData.dataObjInit(job, "new", "create")
                .then((result) => {
                    console.log("Successfully created job record for jobid" + result.id)
                    res.send(result);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send(err);
                });

        })
        .catch((err) => {

            console.error("Failed to geocode Billing Address for job " + req.body.jobId);
            console.error(err);

            let job = new Job(req.params.orgId, false, req.body);
            getData.dataObjInit(job, "new", "create")
                .then((result) => {
                    console.log('job create route getData.dataObjInit(job, "new", "create") result:')
                    console.log(result);
                    console.log("Successfully created job record for jobid " + result.id)
                    res.send(result);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send(err);
                });

        });

});

// show
router.get("/:id", (req, res) => {

    let job = new Job(req.params.orgId, req.params.id, false);
    getData.dataObjInit(job, "view", "show")
        .then((result) => {
            console.log("Retrieved details for job with id " + req.params.id);
            res.send(result);
        })
        .catch((err) => {
            console.error(err);
            console.error("Error in jobs show route")
            res.status(500).send(err);
        });

});

// update
router.put("/:id", (req, res) => {

    let job = new Job(req.params.orgId, req.params.id, false);
    getData.dataObjInit(job, "edit", "update")
        .then((result) => {
            console.log("Updated details for job with id " + req.params.id);
            res.send(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });

});

// destroy
router.delete("/:id", (req, res) => {

    let job = new Job(req.params.orgId, req.params.id, req.body);
    getData.dataObjInit(job, "delete", "destroy")
        .then((result) => {
            console.log("Deleted details for job with id " + req.params.id);
            res.send(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });

});

module.exports = router;