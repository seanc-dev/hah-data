import gs from "google-spreadsheet";

import config from "./config.js";
// import mapping from "./mapping.js";
// import lib from "./library.js";
// import creds from "../secret/client_secret.json" assert { type: "json" };

const creds = process.env.GOOGLE_CONFIG ?? "";
const { GoogleSpreadsheet } = gs;

export default {
	addRow: async function (organisationId, workSheetIndex, newRowObj) {
		const doc = new GoogleSpreadsheet(
			config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]
		);

		try {
			await doc.useServiceAccountAuth(creds);
			await doc.loadInfo();

			const sheet = doc.sheetsByIndex[workSheetIndex];

			const row = await sheet.addRow(newRowObj);

			return row;
		} catch (err) {
			console.error(err);
		}
	},

	getAddressDetailsString: function (organisationId, clientId) {
		return new Promise((resolve, reject) => {
			// pull address details for client
			this.getRowsXCellsArray(
				organisationId,
				config[process.env.NODE_ENV][organisationId].formTargets.client
					.sheetIndex,
				clientId,
				clientId,
				[10, 11]
			)
				.then(function (result) {
					console.log(result.data[0]);
					resolve(result.data[0]);
				})
				.catch(reject);
		});
	},

	getCellsArray: function (organisationId, workSheetIndex, cellIndexArray) {
		const doc = new GoogleSpreadsheet(
			config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]
		);

		return new Promise((resolve, reject) => {
			cellIndexArray = cellIndexArray.sort((a, b) => a - b);

			// Authenticate with the Google Spreadsheets API.
			doc.useServiceAccountAuth(creds, function (err) {
				if (err) reject(err);

				// get all cells in range
				doc.getCells(
					workSheetIndex,
					{
						"min-col": cellIndexArray[0],
						"max-col": cellIndexArray[cellIndexArray.length - 1],
					},
					function (err, cells) {
						console.log(err);

						if (err) reject(err);
						if (!cells || cells.length < 0)
							reject(new Error("Cells array returned empty"));

						let obj = {
							headers: [],
							data: [],
						};

						let filtered = cells.reduce((acc, val, i) => {
							// if current column is included in parameters, continue
							if (cellIndexArray.includes(val.col)) {
								// if this is header row, add data to headers array
								if (val.row == 1) {
									if (val.col == cellIndexArray[0]) acc.headers.push([]);
									acc.headers[acc.headers.length - 1].push(
										val._numericValue || val._value
									);
									// else add to data
								} else {
									if (val.col == cellIndexArray[0]) acc.data.push([]);
									acc.data[acc.data.length - 1].push(
										val._numericValue || val._value
									);
								}
							}
							return acc;
						}, obj);

						resolve(filtered);
					}
				);
			});
		});
	},

	getClientDetailsArray: async function (organisationId) {
		try {
			// get client details and account names
			let arr = await this.getCellsArray(
				organisationId,
				config[process.env.NODE_ENV][organisationId].formTargets.client
					.sheetIndex,
				[2, 3, 10, 11]
			);
			// reorganise returned data into array of objects and return
			return arr.data.map(function (val, i) {
				return {
					clientId: val[0],
					accountName: val[1],
					billingAddressStreet: val[2],
					billingAddressSuburb: val[3],
				};
			});
		} catch (err) {
			console.log("Error in getClientDetailsArray getCellsArray request");
			console.error(err);
			return err;
		}
	},

	getColumnValuesArray: function (organisationId, workSheetIndex, cellIndex) {
		const doc = new GoogleSpreadsheet(
			config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]
		);

		return new Promise((resolve, reject) => {
			// Authenticate with the Google Spreadsheets API.
			doc.useServiceAccountAuth(creds, function (err) {
				if (err) reject(err);

				// get all cells in range
				doc.getCells(
					workSheetIndex,
					{
						"min-col": cellIndex,
						"max-col": cellIndex,
					},
					function (err, cells) {
						if (err) reject(err);

						let obj = {
							headers: [],
							data: [],
						};
						let filtered = cells.reduce((acc, val, i) => {
							// if this is header row, add data to headers array
							if (val.row == 1) {
								acc.headers.push(val._numericValue || val._value);
								// else add to data
							} else {
								acc.data.push(val._numericValue || val._value);
							}

							return acc;
						}, obj);

						resolve(filtered);
					}
				);
			});
		});
	},

	getJobDetailsArray: async function (organisationId) {
		try {
			// get job details and account names
			let arr = await this.getCellsArray(
				organisationId,
				config[process.env.NODE_ENV][organisationId].formTargets.job.sheetIndex,
				[1, 2, 4, 9, 10]
			);
			// map to array of objects and return
			return arr.data.map(function (val, i) {
				return {
					clientId: val[0],
					jobId: val[1],
					accountName: val[2],
					dateInvoiceSent: val[3],
					amountInvoiced: val[4],
				};
			});
		} catch (err) {
			console.error("Error in getJobsDetailsArray getCellsArray request");
			console.error(err);
		}
	},

	getRows: async (organisationId, worksheetIndex, offset, limit) => {
		const doc = new GoogleSpreadsheet(
			config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]
		);

		try {
			await doc.useServiceAccountAuth(creds);
			await doc.loadInfo();

			const sheet = doc.sheetsByIndex[worksheetIndex];
			const rows = await sheet.getRows({
				offset,
				limit,
			});
			return rows;
		} catch (err) {
			console.error(
				`ss.getRows error for orgId ${organisationId} and worksheetIndex ${worksheetIndex}`
			);
			console.error(err);
		}
	},

	getRowsArray: async function (
		organisationId, // shorthand for the spready to reference
		worksheetIndex, // index for the sheet from which to pull data
		filterIndex, // column to search for filter values
		filterValuesArray, // values by which to select rows for return
		offset, // tech debt?
		limit // tech debt?
	) {
		const rows = await this.getRows(
			organisationId,
			worksheetIndex,
			offset,
			limit
		);

		const filteredRows = rows.filter(
			function (rowObject) {
				return this.indexOf(rowObject._rawData[filterIndex]) >= 0;
			},
			filterValuesArray.map((val) => `` + val)
		);

		return filteredRows;
	},

	getRowsArrayDataOnly: async function (
		organisationId,
		dimension,
		mapping,
		filterIndex,
		filterValueArray
	) {
		const sheetIndex =
				config[process.env.NODE_ENV][organisationId]["formTargets"][dimension]
					.sheetIndex,
			doc = new GoogleSpreadsheet(
				config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]
			);

		// console.log(`filterIndex: ${filterIndex}`);
		// console.log(`filterValueArray of type ${typeof filterValueArray[0]}:`);
		// console.log(filterValueArray);

		const rows = await this.getRowsArray(
			organisationId,
			sheetIndex - 1,
			filterIndex,
			filterValueArray
		);

		const newRowsArr = rows.map((val) => {
			let obj = {};
			for (let i = 0; i < mapping.length; i++) {
				let key = mapping[i].sheetHeaderName;
				if (val[key]) obj[key] = val[key];
			}
			return obj;
		});

		return newRowsArr;
	},

	getRowsXCellsArray: function (
		organisationId,
		workSheetIndex,
		rowMin,
		rowMax,
		cellIndexArray
	) {
		const doc = new GoogleSpreadsheet(
			config[process.env.NODE_ENV][organisationId]["targetSpreadsheetId"]
		);

		return new Promise((resolve, reject) => {
			cellIndexArray = cellIndexArray.sort((a, b) => a - b);

			// Authenticate with the Google Spreadsheets API.
			doc.useServiceAccountAuth(creds, function (err) {
				if (err) reject(err);

				// get all cells in range
				doc.getCells(
					workSheetIndex,
					{
						"min-col": cellIndexArray[0],
						"max-col": cellIndexArray[cellIndexArray.length - 1],
						"min-row": rowMin,
						"max-row": rowMax,
					},
					function (err, cells) {
						if (err) reject(err);

						let obj = {
							headers: [],
							data: [],
						};
						let filtered = cells.reduce((acc, val, i) => {
							// if current column is included in parameters, continue
							if (cellIndexArray.includes(val.col)) {
								// if this is header row, add data to headers array
								if (val.row == 1) {
									if (val.col == cellIndexArray[0]) acc.headers.push([]);
									acc.headers[acc.headers.length - 1].push(
										val._numericValue || val._value
									);
									// else add to data
								} else {
									if (val.col == cellIndexArray[0]) acc.data.push([]);
									acc.data[acc.data.length - 1].push(
										val._numericValue || val._value
									);
								}
							}
							return acc;
						}, obj);

						resolve(filtered);
					}
				);
			});
		});
	},
};
