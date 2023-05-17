import express from "express";

import getData from "./services/getData.js";
import formOptions from "../lib/form-options.js";
import { getNewFormObject } from "../lib/library.js";

const router = express.Router({
	mergeParams: true,
});

// show form
router.get("/:orgShortName", function (req, res) {
	console.log('index show route for ', req.params.orgShortName, ' triggered')
	let { orgShortName } = req.params;
	if (orgShortName === "kapiti" || orgShortName === "wellington") {
		if (!req.query.data) {
			res.render("forms", {
				businessName: orgShortName,
				businessNameDisplay:
					orgShortName[0].toUpperCase() + orgShortName.slice(1),
			});
		} else {
			getData
				.getOrgDetailsByShortName(orgShortName)
				.then(({ organisationId, staffNames }) => {
					const data = {
						formOptions: {
							...getNewFormObject(formOptions[orgShortName], staffNames),
							// clientDetails: {
							// 	...formOptions[orgShortName].clientDetails,
							// 	fields: {
							// 		...formOptions[orgShortName].clientDetails.fields,
							// 		cd_territory: {
							// 			...formOptions[orgShortName].clientDetails.fields
							// 				.cd_territory,
							// 			values: ["", ...territories],
							// 		},
							// 	},
							// },
						},
						businessName: orgShortName,
						businessNameDisplay:
							orgShortName[0].toUpperCase() + orgShortName.slice(1),
						organisationId,
						staffNames,
					};
					res.send(data);
				})
				.catch((err) => {
					console.error(err);
					res.status(500).send(err);
				});
		}
	} else {
		res.status(404).send("Not found");
	}
});

export default router;
