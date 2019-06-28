const   DataObject = require("./dataobject.js"),
        mapping = require("../mapping.js"),
        config = require("../config.js"),
        lib = require("../library.js"),
        ss = require("../spreadsheet.js");


class Client extends DataObject {

    constructor(organisationId, id, formData) {

        super(organisationId, id, "client", formData);

        this.jobWorksheetIndex = config[process.env.NODE_ENV][this.organisationId]["formTargets"]["job"].sheetIndex;
        this.jobMapping = mapping[this.organisationId]["job"];

        if (!id) { 
            this.generateId()
                .then(function(result){

                    this.data[this.dimension + "Id"] = result;

                    this.computeColumns()
                        .then(function(result){

                            // if no id provided, this is a new entry and should be appended to the google sheet
                            this.appendRow();

                        }.bind(this))
                        .catch(console.error);

                }.bind(this))
                .catch(console.error);

        } else {

            // set this.data from row in sheet
            this.getDataFromSheet()
                .then(function(result){


                    this.computeColumns()
                        .then(function(result){

                            console.log("Calling Client.updateSheetRow")

                            // if an id has been provided, this is an existing entry and needs to be updated
                            this.updateSheetRow();

                        }.bind(this))
                        .catch((err) => {

                            console.error("Error in compute columns return in Client constructor")
                            console.error(err);

                        });

                }.bind(this))
                .catch((err) => {

                    console.log("Error in Client.getDataFromSheet return in Client constructor")

                });

        }

    }

    computeColumns() {

        // retrieve all jobs rows for this client then use them to construct the computed columns
        return ss.getRowsArrayDataOnly(this.organisationId, "job", this.jobMapping, 1, "clientid = " + this._id)
            .then(function (result) {

                for (let i = 0; i < result.length; i++) {

                    result[i] = lib.objValuesStrToNumber(result[i]);

                }

                this.countJobs(result);
                this.sumJobValue(result);
                this.sumJobCost(result);
                this.sumJobGrossProfit();
                this.sumJobHours(result);
                this.accountNameFriendly();
                this.mostRecentJobInvoicedDate(result);

                return result;

            }.bind(this))
            .catch((err) => {

                console.error("Error in ss.getRowsArrayDataOnly return in Client.computeColumns")
                console.error(err);

            });

    }

    accountNameFriendly() {

        this.data.accountNameFriendly = this.data.accountName.replace(/"'/g, "");

    }

    countJobs(arr) {

        this.data.countJobs = arr.length;

    }

    mostRecentJobInvoicedDate(arr) {

        let dt = lib.getMaxDateFromArray(arr, "dateinvoicesent");
        this.data.mostRecentJobInvoicedDate = dt

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