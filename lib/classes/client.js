const clientQueries = require("./../../routes/services/queries/client"),
  DataObject = require("./dataobject.js"),
  mapping = require("../mapping.js"),
  config = require("../config.js"),
  lib = require("../library.js"),
  ss = require("../spreadsheet.js");

class Client extends DataObject {
  constructor(organisationId, id, formData) {
    super(organisationId, id, "client", formData);

    this.jobWorksheetIndex =
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
      throw err;
    }
  }

  async computeColumns() {
    let rowsArr;
    // retrieve all job rows for this client then use them to construct the computed columns
    try {
      rowsArr = await ss.getRowsArrayDataOnly(
        this.organisationId,
        "job",
        this.jobMapping,
        1,
        "clientid = " + this._id
      );
    } catch (err) {
      console.error(
        "Error in ss.getRowsArrayDataOnly return in Client.computeColumns"
      );
      console.error(err);
    }

    for (let i = 0; i < rowsArr.length; i++) {
      rowsArr[i] = lib.objValuesStrToNumber(rowsArr[i]);
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

  countJobs(arr) {
    this.data.countJobs = arr.length;
  }

  mostRecentJobInvoicedDate(arr) {
    let dt = lib.getMaxDateFromArray(arr, "dateinvoicesent");
    this.data.mostRecentJobInvoicedDate = dt;
  }

  sumJobCost(arr) {
    let fieldName = "totalJobCost",
      APIName = lib.getSheetsAPIName(this.jobMapping, fieldName);

    this.data.sumJobCost = lib.sumKeyInObjectsArray(arr, APIName);
  }

  sumJobHours(arr) {
    let fieldName = "totalHoursWorked",
      APIName = lib.getSheetsAPIName(this.jobMapping, fieldName);

    this.data.sumJobHours = lib.sumKeyInObjectsArray(arr, APIName);
  }

  sumJobGrossProfit() {
    this.data.sumJobGrossProfit = this.data.sumJobValue - this.data.sumJobCost;
  }

  sumJobValue(arr) {
    let fieldName = "amountInvoiced",
      APIName = lib.getSheetsAPIName(this.jobMapping, fieldName);

    this.data.sumJobValue = lib.sumKeyInObjectsArray(arr, APIName);
  }
}

module.exports = Client;
