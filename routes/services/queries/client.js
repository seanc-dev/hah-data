import clientQueries from "./queryBuilders/client.js";
import lib from "./../../../lib/library.js";
import staffQueries from "./staff.js";

import dbConfig from "./../../../lib/db_config.js";

const { pool } = dbConfig;

export default {
	createClient: async (req, res) => {
		const { orgId } = req.params;
		let id;
		const body = lib.prepareDataForDbInsert(req.body);
		if (body.mainContactFirstName.toLowerCase() === "test") body.test = 1;
		const pgClient = await pool.connect();
		try {
			await pgClient.query("begin");
			const queries = require("./index");
			const orgIdResult = await queries.getOrgId(orgId, pgClient);
			const result = await pgClient.query(
				"insert into client (organisationid, accountname, maincontactfirstname, maincontactlastname, maincontactemail, maincontactmobile, maincontactlandline, businessname, billingaddressstreet, billingaddresssuburb, territory, customerdemographic, estimatedcustomerincome, acquisitionchannel, test) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) returning id",
				[
					orgIdResult,
					body["accountName"],
					body["mainContactFirstName"],
					body["mainContactLastName"],
					body["mainContactEmail"],
					body["mainContactMobile"],
					body["mainContactLandline"],
					body["businessName"],
					body["billingAddressStreet"],
					body["billingAddressSuburb"],
					body["territory"],
					body["customerDemographic"],
					body["estimatedCustomerIncome"],
					body["acquisitionChannel"],
					body["test"],
				]
			);
			await pgClient.query("commit");
			id = result.rows[0].id;
			res.json({ id });
		} catch (err) {
			pgClient.query("rollback");
			res.status(500).send(err);
			throw err;
		} finally {
			pgClient.release();
		}
		const Client = require("../../../lib/classes/client");
		const getData = require("../getData");
		getData.crud(new Client(orgId, id, body), "new");
	},
	getClientDetails: async (req, res) => {
		try {
			let results = await pool.query(
				"SELECT c.id, accountname, billingaddressstreet, billingaddresssuburb FROM client as c inner join organisation as o on c.organisationid = o.id where o.shortname = $1",
				[req.params.orgId]
			);
			let arr = results.rows.map((obj) => {
				return {
					clientId: obj.id,
					accountName: obj.accountname,
					billingAddressStreet: obj.billingaddressstreet,
					billingAddressSuburb: obj.billingaddresssuburb,
				};
			});
			res.json(arr);
		} catch (err) {
			console.error(err);
			res.status(500).send(err);
		}
	},
	getClientById: async (id, orgId) => {
		let clientDetailsObject;
		const client = await pool.connect();
		try {
			const staffNames = await staffQueries.getStaffNames(orgId, client);
			// pull detail of all jobs for client
			const jobDetails = await client.query(
				clientQueries.getJobsByClientIdQuery(staffNames),
				[id]
			);
			// pull client details
			const clientResult = await client.query(
				"select * from client where id = $1",
				[id]
			);
			// map dbHeaders to fieldNames (to play nice with front-end)
			const clientObj = clientResult.rows[0];
			const mappedClientObj = {};
			Object.keys(clientObj).forEach((key) => {
				if (key !== "organisationid")
					mappedClientObj[
						lib.getObjectFromKey(orgId, "client", "dbHeader", key, "fieldName")
					] = clientObj[key];
			});
			// concat job details to client
			const jobDetailsData = jobDetails.rows;
			clientDetailsObject = {
				...mappedClientObj,
				countJobs: jobDetailsData.length,
				sumJobValue: lib.sumKeyInObjectsArray(jobDetailsData, "amountinvoiced"),
				sumJobCost: lib.sumKeyInObjectsArray(jobDetailsData, "totaljobcost"),
				sumJobGrossProfit: lib.sumKeyInObjectsArray(
					jobDetailsData,
					"grossprofit"
				),
				sumJobHours: lib.sumKeyInObjectsArray(
					jobDetailsData,
					"totalhoursworked"
				),
				mostRecentJobInvoicedDate: lib.getMaxDateFromArrayOfObjects(
					jobDetailsData,
					"dateinvoicesentutc"
				),
			};
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
		return clientDetailsObject;
	},
	updateClientById: (req, res) => {
		const { id, orgId } = req.params;
		const body = lib.prepareDataForDbInsert(req.body);
		try {
			pool.query(
				"update client set maincontactfirstname = $1, maincontactlastname = $2, maincontactemail = $3, maincontactmobile = $4, maincontactlandline = $5, businessname = $6, billingaddressstreet = $7, billingaddresssuburb = $8, territory = $9, customerdemographic = $10, estimatedcustomerincome = $11, acquisitionchannel = $12 where id = $13",
				[
					body["mainContactFirstName"],
					body["mainContactLastName"],
					body["mainContactEmail"],
					body["mainContactMobile"],
					body["mainContactLandLine"],
					body["businessName"],
					body["billingAddressStreet"],
					body["billingAddressSuburb"],
					body["territory"],
					body["customerDemographic"],
					body["estimatedCustomerIncome"],
					body["acquisitionChannel"],
					id,
				]
			);
			res.send(`Client record with id ${id} successfully updated`);
		} catch (err) {
			console.error(err);
			res.status(500).send(err);
		}
		const Client = require("../../../lib/classes/client");
		const getData = require("../getData");
		getData.crud(new Client(orgId, id, body), "edit");
	},
	deleteClientById: async (req, res) => {
		const { id } = req.params;
		const client = await pool.connect();
		try {
			await client.query("begin");
			await client.query(
				"delete from staff_job_hours as sjh inner join job as j where jobid = $1",
				[id]
			);
			await client.query("delete from job where id = $1", [id]);
			await client.query("commit");
			res.json(result.rows[0]);
			console.log(`Job record with id ${id} successfully deleted`);
		} catch (err) {
			client.query("rollback");
			res.status(500).send(err);
			throw err;
		} finally {
			client.release();
		}
	},
};
