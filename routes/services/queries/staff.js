import dbConfig from "../../../lib/db_config.js";
import staffQueries from "./queryBuilders/staff.js";
import { getOrgIdFromShortName } from "./organisation.js";
import { prepareDataForDbInsert } from "../../../lib/library.js";

const { pool } = dbConfig;
const { getStaffRatesByJobId } = staffQueries;
const staffDetailsQuery = `select s.id, s.staffmembername, staffmemberstartdateutc, s.currentlyemployed, srh.hourlyrate, srh.hourlyrateeffectivedateutc from (select staffid, max(hourlyrateeffectivedateutc) as maxratedate from staff_rate_history group by staffid) mr inner join staff_rate_history srh on srh.staffid = mr.staffid and srh.hourlyrateeffectivedateutc = mr.maxratedate inner join staff s on srh.staffid = s.id inner join organisation o on s.organisationid = o.id where o.shortname = $1`;

const rateHistoryInsert = async (
	xClient,
	{ staffId, hourlyRate, hourlyRateEffectiveDateUTC }
) => {
	const client = (await xClient) || pool.connect();
	const insertStaffRateHistoryQuery = `insert into staff_rate_history (staffid, hourlyrate, hourlyrateeffectivedateutc) values ($1, $2, $3) returning id`;
	const {
		rows: [{ id: rateHistoryId }],
	} = await client.query(insertStaffRateHistoryQuery, [
		staffId,
		hourlyRate,
		hourlyRateEffectiveDateUTC,
	]);
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
		const client = await pool.connect();
		const {
			body,
			params: { orgId },
		} = req;
		try {
			// create new staff member
			client.query("BEGIN");
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
			const insertStaffResult = await client.query(insertStaffQuery, [
				staffMemberName,
				staffMemberStartDateUTC,
				staffMemberEndDateUTC,
				currentlyEmployed === 0 ? 0 : 1,
				numericalOrgId,
			]);
			// return new staff member id
			const staffId = insertStaffResult.rows[0].id;
			// create new staff rate history entry
			const rateHistoryId = await rateHistoryInsert(client, {
				staffId,
				hourlyRate,
				hourlyRateEffectiveDateUTC,
			});

			// update previous rate expiry date
			const updateStaffRateHistoryQuery = `update staff_rate_history srh set hourlyrateexpirydateutc = med.maxeffectivedate from (select max(hourlyrateeffectivedateutc) as maxeffectivedate, staffid from staff_rate_history where staffid = $1 and hourlyrateexpirydateutc is null group by staffid) med where srh.staffid = $1 and srh.staffid = med.staffid and srh.hourlyrateeffectivedateutc != med.maxeffectivedate and hourlyrateexpirydateutc is null;`;
			await client.query(updateStaffRateHistoryQuery, [
				hourlyRateEffectiveDateUTC,
				staffId,
				rateHistoryId,
			]);

			// commit transaction
			client.query("COMMIT");

			// send response with new staff member details
			res.json(staffId);
		} catch (err) {
			// rollback transaction
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
			const { orgId, id } = req.params;
			const {
				staffMemberName,
				staffMemberStartDateUTC,
				staffMemberEndDateUTC,
				currentlyEmployed = 0,
				hourlyRate,
				hourlyRateEffectiveDateUTC,
			} = prepareDataForDbInsert(req.body);
			const updateStaffQuery = `update staff set staffmembername = $1, staffmemberstartdateutc = $2, staffmemberenddateutc = $3, currentlyemployed = $4 where id = $5 returning id`;
			client.query("begin");
			const updateStaffResult = await client.query(updateStaffQuery, [
				staffMemberName,
				staffMemberStartDateUTC,
				staffMemberEndDateUTC,
				currentlyEmployed === 0 ? 0 : 1,
				id,
			]);
			// return new staff member id
			const staffId = updateStaffResult.rows[0].id;
			// update staff rate history entry
			if (hourlyRate && hourlyRateEffectiveDateUTC)
				rateHistoryInsert(client, {
					staffId,
					hourlyRate,
					hourlyRateEffectiveDateUTC,
				});
			client.query("commit");
			// return staff member details
			const staffDetails = await this.getStaffMemberById(staffId, orgId);
			// send response with staff member details
			res.json(staffDetails);
		} catch (err) {
			client.query("rollback");
			console.error(err);
			res.status(500).send(err);
		} finally {
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
		if (!client) client = pool;

		let jobHoursQueryStr =
			"insert into staff_job_hours (jobid, staffid, hoursworked) values ";
		const parametersArray = [];

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
};
