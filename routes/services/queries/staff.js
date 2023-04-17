import dbConfig from "../../../lib/db_config.js";
import staffQueries from "./queryBuilders/staff.js";
import { getOrgIdFromShortName } from "./organisation.js";
import { prepareDataForDbInsert } from "../../../lib/library.js";

const { pool } = dbConfig;
const { getStaffRatesByJobId } = staffQueries;
const staffDetailsQuery = `select s.id, s.staffmembername, staffmemberstartdateutc, s.currentlyemployed, srh.hourlyrate, srh.hourlyrateeffectivedateutc from (select staffid, max(hourlyrateeffectivedateutc) as maxratedate from staff_rate_history group by staffid) mr inner join staff_rate_history srh on srh.staffid = mr.staffid and srh.hourlyrateeffectivedateutc = mr.maxratedate inner join staff s on srh.staffid = s.id inner join organisation o on s.organisationid = o.id where o.shortname = $1`;

const rateHistoryInsertAndUpdate = async (
	xClient,
	{ staffId, hourlyRate, hourlyRateEffectiveDateUTC }
) => {
	const client = (await xClient) || pool.connect();
	const insertStaffRateHistoryQuery = `insert into staff_rate_history (staffid, hourlyrate, hourlyrateeffectivedateutc) values ($1, $2, $3) returning id`;

	// insert new record into rate history
	console.log("inserting staff rate history record");
	const {
		rows: [{ id: rateHistoryId }],
	} = await client.query(insertStaffRateHistoryQuery, [
		staffId,
		hourlyRate,
		hourlyRateEffectiveDateUTC,
	]);

	// update existing record expiry date in rate history
	console.log("updating previous rate expiry date");
	const updateStaffRateHistoryQuery = `update staff_rate_history srh set hourlyrateexpirydateutc = med.maxeffectivedate from (select max(hourlyrateeffectivedateutc) as maxeffectivedate, staffid from staff_rate_history where staffid = $1 and hourlyrateexpirydateutc is null group by staffid) med where srh.staffid = $1 and srh.staffid = med.staffid and srh.hourlyrateeffectivedateutc != med.maxeffectivedate and hourlyrateexpirydateutc is null;`;
	await client.query(updateStaffRateHistoryQuery, [staffId]);
	return rateHistoryId;
};

const mapStaffDetails = (rows) =>
	rows.reduce(
		(
			acc,
			{
				id,
				staffmembername,
				staffmemberstartdateutc,
				currentlyemployed,
				hourlyrate,
				hourlyrateeffectivedateutc,
			}
		) => {
			return [
				...acc,
				{
					id,
					staffMemberName: staffmembername,
					staffMemberStartDateUTC: staffmemberstartdateutc,
					currentlyEmployed: currentlyemployed,
					hourlyRate: hourlyrate,
					hourlyRateEffectiveDateUTC: hourlyrateeffectivedateutc,
				},
			];
		},
		[]
	);

export default {
	getStaffNames: async function (orgShortName, client) {
		if (!client) client = pool;
		try {
			const result = await client.query(
				"select distinct staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1 and s.currentlyemployed = 1",
				[orgShortName]
			);
			return result.rows.map((row) => row.staffmembername);
		} catch (err) {
			console.error(err);
		}
	},

	getStaffDetails: async function (req, res) {
		try {
			const client = await pool.connect();
			const staffResult = await client.query(staffDetailsQuery, [
				req.params.orgId,
			]);
			const staffDetails = mapStaffDetails(staffResult.rows);
			res.json(staffDetails);
		} catch (err) {
			console.log("error in getStaffDetails query");
			console.error(err);
			res.status(500).send(err);
		}
	},

	getStaffMemberById: async function (id, orgShortName) {
		try {
			const client = await pool.connect();
			const staffResult = await client.query(
				`${staffDetailsQuery} and s.id = $2`,
				[orgShortName, id]
			);
			const staffDetails = mapStaffDetails(staffResult.rows);
			return staffDetails[0];
		} catch (err) {
			console.error(err);
		}
	},

	createStaffMember: async function (req, res) {
		console.log("running createStaffMember query");
		const client = await pool.connect();
		const {
			body,
			params: { orgId },
		} = req;
		try {
			// create new staff member
			client.query("BEGIN");
			console.log("getting org id from short name: ", orgId);
			const numericalOrgId = await getOrgIdFromShortName(orgId, client);
			console.log(body);
			const {
				staffMemberName,
				staffMemberStartDateUTC,
				staffMemberEndDateUTC,
				currentlyEmployed = 0,
				hourlyRate,
				hourlyRateEffectiveDateUTC,
			} = prepareDataForDbInsert(body);
			const insertStaffQuery = `insert into staff (staffmembername, staffmemberstartdateutc, staffmemberenddateutc, currentlyemployed, organisationid) values ($1, $2, $3, $4, $5) returning id`;
			console.log("inserting staff member: ", staffMemberName);
			const insertStaffResult = await client.query(insertStaffQuery, [
				staffMemberName,
				staffMemberStartDateUTC,
				staffMemberEndDateUTC,
				currentlyEmployed === 0 ? 0 : 1,
				numericalOrgId,
			]);
			// return new staff member id
			const staffId = insertStaffResult.rows[0].id;
			// create new staff rate history entry and update previous rate expiry date
			await rateHistoryInsertAndUpdate(client, {
				staffId,
				hourlyRate,
				hourlyRateEffectiveDateUTC,
			});

			// commit transaction
			console.log("committing transaction");
			client.query("COMMIT");

			// send response with new staff member details
			res.json(staffId);
		} catch (err) {
			// rollback transaction
			console.log("rolling back transaction");
			client.query("ROLLBACK");
			console.error(err);
			res.status(500).send(err);
		} finally {
			client.release();
		}
	},

	updateStaffMemberById: async function (req, res) {
		const client = await pool.connect();
		try {
			// destructure params and body
			const { id } = req.params;
			const {
				staffMemberName,
				staffMemberStartDateUTC,
				staffMemberEndDateUTC,
				currentlyEmployed = 0,
				hourlyRate,
				hourlyRateEffectiveDateUTC,
			} = prepareDataForDbInsert(req.body);
			client.query("begin");

			// update staff member
			const updateStaffQuery = `update staff set staffmembername = $1, staffmemberstartdateutc = $2, staffmemberenddateutc = $3, currentlyemployed = $4 where id = $5 returning id`;
			const updateStaffResult = await client.query(updateStaffQuery, [
				staffMemberName,
				staffMemberStartDateUTC,
				staffMemberEndDateUTC,
				currentlyEmployed === 0 ? 0 : 1,
				id,
			]);

			// update staff rate history
			const staffId = updateStaffResult.rows[0].id;
			const {
				rows: [{ hourlRate: currentRate }],
			} = await pool.query(
				`select * from staff_rate_history where staffid = $1 and hourlyrateexpirydateutc is null`,
				[staffId]
			);
			if (currentRate !== hourlyRate)
				rateHistoryInsertAndUpdate(client, {
					staffId,
					hourlyRate,
					hourlyRateEffectiveDateUTC,
				});

			// commit transaction
			client.query("commit");

			// send response with staff member details
			res.json(staffId);
		} catch (err) {
			// rollback, log, and send error
			client.query("rollback");
			console.error(err);
			res.status(500).send(err);
		} finally {
			// release db connection
			client.release();
		}
	},

	getStaffRatesByJobId: async function (orgId, jobId) {
		let ratesResult;
		try {
			const staffNames = await this.getStaffNames(orgId);
			ratesResult = await pool.query(getStaffRatesByJobId(staffNames), [jobId]);
			return ratesResult.rows[0];
		} catch (err) {
			console.error(err);
		}
	},

	getStaffIdArray: async (orgId, client) => {
		if (!client) client = pool;
		const staffResult = await client.query(
			"select s.id, s.staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1 and currentlyemployed = 1",
			[orgId]
		);
		const staffIdArray = staffResult.rows;
		return staffIdArray;
	},

	insertStaffJobHours: async (staffNames, staffIdArray, id, body, client) => {
		if (!client) client = pool.connect();

		let jobHoursQueryStr =
			"insert into staff_job_hours (jobid, staffid, hoursworked) values ";
		const parametersArray = [];

		// loop through staff names and create query string and parameter array
		staffNames.forEach((name, idx) => {
			const idxMultiple = idx * 3;
			const staffObj = staffIdArray.find(
				({ staffmembername }) =>
					staffmembername.replace(" ", "").toLowerCase() ===
					name.replace(" ", "").toLowerCase()
			);
			if (!staffObj) return;
			const staffId = staffObj.id;
			const hoursWorked = body[`hoursWorked${name}`];
			jobHoursQueryStr += `($${1 + idxMultiple}, $${2 + idxMultiple}, $${
				3 + idxMultiple
			})${idx !== staffNames.length - 1 ? ", " : ""}`;
			parametersArray[0 + idxMultiple] = id;
			parametersArray[1 + idxMultiple] = staffId;
			parametersArray[2 + idxMultiple] = hoursWorked;
		});
		try {
			return await client.query(jobHoursQueryStr, parametersArray);
		} catch (err) {
			console.error(err);
		}
	},

	updateStaffJobHours: async (jobId, body, client) => {
		if (!client) client = pool.connect();
		// select all staff_job_hours records for this job
		const { rows: jobHoursRows } = await client.query(
			"select * from staff_job_hours where jobid = $1",
			[jobId]
		);
		console.log("updateStaffJobHours jobHoursRows");
		console.log(jobHoursRows);
		// const hoursWorked = body[`hoursWorked${name}`];

		// // loop through staff ids and find which have had changes to hours worked for this job
		// const changedHoursIds = staffIDArr.reduce((acc, id) => {
		// 	if (jobHoursRows)

		// // loop through ids with changed hours to update relevant staff_job_hours records for this job
		// `update staff_job_hours set hoursworked = $1 where jobId = $2 and staffid = $3`
	},
};
