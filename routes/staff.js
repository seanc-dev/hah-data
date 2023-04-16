import express from "express";

import queries from "./services/queries/staff.js";
import getData from "./services/getData.js";

const router = express.Router({
	mergeParams: true,
});

// index route
router.get("/", (req, res) => {
	if (req.query.requestType === "detailsArray") {
		queries.getStaffDetails(req, res);
	} else if (req.query.requestType === "keys") {
		getData.getKeysFromDb(req.params.orgId, "staff", req, res);
	}
});

// create route
router.post("/", queries.createStaffMember);

// show
router.get("/:id", (req, res) => {
	const { orgId, id } = req.params;
	queries.getStaffMemberById(id, orgId).then((result) => {
		res.json(result);
	});
});

// update
router.put("/:id", queries.updateStaffMemberById);

// // destroy
// router.delete("/:id", queries.deleteStaffMemberById);

export default router;
