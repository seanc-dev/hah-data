import dbConfig from "../../../lib/db_config.js";
import staffQueries from "./queryBuilders/staff.js";

const { pool } = dbConfig;
const { getStaffRatesByJobId } = staffQueries;
const staffDetailsQuery = `select s.id, s.staffmembername, staffmemberstartdateutc, s.currentlyemployed, srh.hourlyrate, srh.hourlyrateeffectivedateutc from (select staffid, max(hourlyrateeffectivedateutc) as maxratedate from staff_rate_history group by staffid) mr inner join staff_rate_history srh on srh.staffid = mr.staffid and srh.hourlyrateeffectivedateutc = mr.maxratedate inner join staff s on srh.staffid = s.id inner join organisation o on s.organisationid = o.id where o.shortname = $1`;

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

	getStaffRatesByJobId: async function (orgId, jobId) {
		let ratesResult;
		let staffNames = await this.getStaffNames(orgId);
		console.log(staffNames);
		try {
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
