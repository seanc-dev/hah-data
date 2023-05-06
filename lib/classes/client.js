import territoryQueries from "../../routes/services/queries/territories.js";
import clientQueries from "./../../routes/services/queries/client.js";
import DataObject from "./dataobject.js";
import mapping from "../mapping.js";
import ss from "../spreadsheet.js";
import config from "../config.js";
import {
	getMaxDateFromArrayOfObjects,
	sumKeyInObjectsArray,
	objValuesStrToNumber,
} from "../library.js";

const { getAreaByTerritoryName } = territoryQueries;

class Client extends DataObject {
	constructor(organisationId, id, formData) {
		super(organisationId, id, "client", formData);

		this.jobWorksheetIndex =
			// eslint-disable-next-line no-undef
			config[process.env.NODE_ENV][this.organisationId]["formTargets"][
				"job"
			].sheetIndex;
		this.jobMapping = mapping[this.organisationId]["job"];
	}

	async getDataFromDb() {
		try {
			this.data = await clientQueries.getClientById(
				this._id,
				this.organisationId
			);
		} catch (err) {
			console.error(err);
		}
		this.convertAndFormatDates();
	}

	async computeColumns() {
		let rowsArr;
		// retrieve all job rows for this client then use them to construct the computed columns
		try {
			rowsArr = await ss.getRowsArrayDataOnly(
				this.organisationId,
				"job",
				this.jobMapping,
				0,
				[this._id]
			);
			await this.setArea();
		} catch (err) {
			console.error(
				"Error in ss.getRowsArrayDataOnly return in Client.computeColumns"
			);
			console.error(err);
		}

		for (let i = 0; i < rowsArr.length; i++) {
			rowsArr[i] = objValuesStrToNumber(rowsArr[i]);
		}

		this.countJobs(rowsArr);
		this.sumJobValue(rowsArr);
		this.sumJobCost(rowsArr);
		this.sumJobGrossProfit();
		this.sumJobHours(rowsArr);
		this.accountNameFriendly();
		this.mostRecentJobInvoicedDate(rowsArr);

		return rowsArr;
	}

	accountNameFriendly() {
		if (this.data.accountName)
			this.data.accountNameFriendly = this.data.accountName.replace(/"'/g, "");
	}

	async setArea() {
		if (!this.data.territory) return;
		try {
			const result = await getAreaByTerritoryName(this.data.territory);
			this.data.area = result.rows[0].areaname;
		} catch (err) {
			console.error(err);
		}
	}

	countJobs(arr) {
		this.data.countJobs = arr.length;
	}

	mostRecentJobInvoicedDate(arr) {
		const dt = getMaxDateFromArrayOfObjects(arr, "Date Invoice Sent");
		this.data.mostRecentJobInvoicedDate = dt;
	}

	sumJobCost(arr) {
		const sheetHeaderName = "Total Job Cost";

		this.data.sumJobCost = sumKeyInObjectsArray(arr, sheetHeaderName);
	}

	sumJobHours(arr) {
		const sheetHeaderName = "Total Hours";

		this.data.sumJobHours = sumKeyInObjectsArray(arr, sheetHeaderName);
	}

	sumJobGrossProfit() {
		this.data.sumJobGrossProfit = this.data.sumJobValue - this.data.sumJobCost;
	}

	sumJobValue(arr) {
		const sheetHeaderName = "Amount Invoiced (excl. GST)";

		this.data.sumJobValue = sumKeyInObjectsArray(arr, sheetHeaderName);
	}
}

export default Client;
