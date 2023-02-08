const express = require("express");
const router = express.Router({
	mergeParams: true,
});

const getData = require("./services/getData.js");
const queries = require("./services/queries/job");

// index route
router.get("/", (req, res) => {
	if (req.query.requestType === "detailsArray") {
		queries.getJobDetails(req, res);
	} else if (req.query.requestType === "keys") {
		getData.getKeysFromDb(req.params.orgId, "job", req, res);
	}
});

// create route
router.post("/", queries.createJob);

// show
router.get("/:id", getData.getJobById);

// update
router.put("/:id", queries.updateJobById);

// clean data in sheets
// router.put("/:id/clean", queries.cleanJobById);

// destroy
router.delete("/:id", queries.deleteJobById);

module.exports = router;
