import territoryQueries from "./queries/territories.js";
import clientQueries from "./queries/client.js";
import staffQueries from "./queries/staff.js";
import jobQueries from "./queries/job.js";
import queries from "./queries/index.js";

const { getTerritories } = territoryQueries;

export default {
	crud: async function (inst, requestType) {
		// initialise instance with requested action
		try {
			const result = await inst.init(requestType);
			console.log(
				`Successful ${requestType} init for ${inst.dimension} record with id ${
					result[`${inst.dimension.toLowerCase()}Id`]
				}`
			);
		} catch (err) {
			console.error(
				`Error in ${inst.dimension} ${requestType} getData.crud: Failed to initiate instance`
			);
			console.error(err);
		}
		try {
			// if job added, edited, or removed, update computed fields on relevant client record
			if (inst.dimension === "job" && requestType !== "view") {
				inst.initClientUpdate.bind(inst)();
			}
		} catch (err) {
			console.error(
				`Failed to initiate client update on job record ${requestType}`
			);
		}
	},
	getKeysFromDb: (orgShortName, dim, req, res) => {
		queries
			.getColumnHeaders(dim.toLowerCase(), orgShortName)
			.then((fieldNames) => {
				res.json({
					fieldNames,
				});
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send(err);
			});
	},
	getOrgDetailsByShortName: async (orgShortName) => {
		let resultArr;
		try {
			resultArr = await Promise.all([
				queries.getOrgId(orgShortName),
				staffQueries.getStaffNames(orgShortName),
				getTerritories(orgShortName),
			]);

			const territories = resultArr[2].rows.map((row) => row.territoryname);

			return {
				organisationId: resultArr[0],
				staffNames: resultArr[1],
				territories,
			};
		} catch (err) {
			console.error(err);
			return err;
		}
	},
	getJobById: (req, res) => {
		const { id, orgId } = req.params;
		jobQueries
			.getJobById(id, orgId)
			.then((result) => {
				res.send(result);
			})
			.catch((err) => {
				console.error(err.stack);
				res.status(500).send(err);
			});
	},
	getClientById: (req, res) => {
		const { id, orgId } = req.params;
		clientQueries
			.getClientById(id, orgId)
			.then((result) => {
				res.send(result);
			})
			.catch((err) => {
				console.error(err.stack);
				res.status(500).send(err);
			});
	},
};
