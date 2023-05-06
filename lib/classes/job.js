import { round, getObjectWithMaxDateFromArray } from "../library.js";
import staffQueries from "../../routes/services/queries/staff.js";
import jobQueries from "../../routes/services/queries/job.js";
import DataObject from "./dataobject.js";
import Client from "./client.js";
import staff from "../staff.js";

class Job extends DataObject {
	constructor(organisationId, id, formData) {
		super(organisationId, id, "job", formData);
		this.getStaffNames();
	}

	initClientUpdate() {
		let client = new Client(this.organisationId, this.data.clientId, false);
		return client.init("edit");
	}

	async getDataFromDb() {
		try {
			this.data = await jobQueries.getJobById(this._id, this.organisationId);
		} catch (err) {
			throw err;
		}
		this.convertAndFormatDates();
	}

	async getStaffNames() {
		try {
			this.staffNames = await staffQueries.getStaffNames(this.dimension);
		} catch (err) {
			throw err;
		}
	}

	async computeColumns() {
		// retrieve staff rate data
		try {
			const result = await staffQueries.getStaffRatesByJobId(
				this.organisationId,
				this._id
			);
			const staffRates = getObjectWithMaxDateFromArray(result, "effectivedate");
			delete staffRates["effectivedate"];

			for (let key in staffRates) {
				let fieldName = staff[this.organisationId].mapping.find((val) => {
					return val.googleRowsAPIName === key;
				}).fieldName;

				this.data[fieldName] = staffRates[key];
			}

			this.costStaff();
			this.totalJobCost();
			this.totalHoursWorked();
			this.hourlyRateInvoiced();
			this.grossProfit();
			this.grossProfitPercentage();
			this.staffGrossProfitPercentage();
			this.grossProfitPerHourWorked();

			return this.data;
		} catch (err) {
			console.error(err);
		}
	}

	accountNameFriendly() {
		this.data.accountNameFriendly = this.data.accountName.replace(/"'/g, "");
	}

	costStaff() {
		let sum = 0;

		for (let i = 0; i < this.staffNames.length; i++) {
			sum +=
				Number(this.data["hoursWorked" + this.staffNames[i]]) *
				Number(this.data["hourlyRate" + this.staffNames[i]]);
		}

		this.data.costStaff = sum;
	}

	grossProfit() {
		this.data.grossProfit =
			Number(this.data.amountInvoiced) - Number(this.data.totalJobCost);
	}

	grossProfitPercentage() {
		this.data.grossProfitPercentage = round(
			Number(this.data.grossProfit) / Number(this.data.amountInvoiced),
			8
		);
	}

	hourlyRateInvoiced() {
		this.data.hourlyRateInvoiced =
			(Number(this.data.amountInvoiced) -
				(Number(this.data.totalJobCost) - Number(this.data.costStaff))) /
			Number(this.data.totalHoursWorked);
	}

	staffGrossProfitPercentage() {
		this.data.staffGrossProfitPercentage = round(
			Number(this.data.grossProfit) /
				(Number(this.data.grossProfit) + Number(this.data.costStaff)),
			8
		);
	}

	grossProfitPerHourWorked() {
		// job.grossProfit / job.totalHoursWorked
		this.data.grossProfitPerHourWorked = round(
			Number(this.data.grossProfit) / Number(this.data.totalHoursWorked),
			8
		);
	}

	totalHoursWorked() {
		let sum = 0;

		console.log("staff list");
		console.log(this.staffNames);

		for (let i = 0; i < this.staffNames.length; i++) {
			let fieldName = "hoursWorked" + this.staffNames[i];
			sum += Number(this.data[fieldName]);
		}

		this.data.totalHoursWorked = sum;
	}

	totalJobCost() {
		this.data.totalJobCost =
			Number(this.data.costMaterials) +
			Number(this.data.costStaff) +
			Number(this.data.costSubcontractor) +
			Number(this.data.costOther) +
			Number(this.data.costTipFees);
	}
}

export default Job;
