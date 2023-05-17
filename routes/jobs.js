import express from "express";

import getData from "./services/getData.js";
import queries from "./services/queries/job.js";

const router = express.Router({
	mergeParams: true,
});

// index route
router.get("/", (req, res) => {
	console.log('index route for jobs triggered for ', req.query.requestType)
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

export default router;
