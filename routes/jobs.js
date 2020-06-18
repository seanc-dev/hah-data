const express = require("express");

const Job = require("../lib/classes/job.js"),
  geocode = require("./services/geocode.js"),
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
router.post("/", (req, res) => {});

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
