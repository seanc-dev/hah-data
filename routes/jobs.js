const express = require("express");

const Job = require("../lib/classes/job.js"),
  lib = require("../lib/library.js"),
  geocode = require("./services/geocode.js"),
  ss = require("../lib/spreadsheet.js"),
  getData = require("./services/getData.js"),
  queries = require("./services/queries/job");

const config = require("../lib/config.js");

const router = express.Router({
  mergeParams: true,
});

// index route
router.get("/", (req, res) => {
  if (req.query.requestType === "detailsArray") {
    queries.getJobDetails(req, res);
  } else if (req.query.requestType === "keys") {
    getData.getKeysFromDb(req.params.orgId, "job", req, res);
  }
});

// create route
router.post("/", (req, res) => {
  let location = `${req.body.workLocationStreet} 
        ${req.body.workLocationSuburb} 
        ${req.body.workLocationCity} 
        ${req.body.workLocationPostcode}`;

  geocode(location)
    .then(function (result) {
      req.body.workLocationLatitude = result[0].latitude;
      req.body.workLocationLongitude = result[0].longitude;
      req.body.workLocationFormattedAddress = result[0].formattedAddress;
      req.body.workLocationGPID = result[0].extra.googlePlaceId;

      getData.crud(res, new Job(req.params.orgId, false, req.body), "new");
    })
    .catch((err) => {
      console.error(
        "Failed to geocode Billing Address for job " + req.body.jobId
      );
      console.error(err);

      getData.crud(res, new Job(req.params.orgId, false, req.body), "new");
    });
});

// show
router.get("/:id", getData.getJobById);

// update
router.put("/:id", (req, res) => {
  getData.crud(res, new Job(req.params.orgId, req.params.id, req.body), "edit");
});

// destroy
router.delete("/:id", (req, res) => {
  getData.crud(
    res,
    new Job(req.params.orgId, req.params.id, req.body),
    "delete"
  );
});

module.exports = router;
