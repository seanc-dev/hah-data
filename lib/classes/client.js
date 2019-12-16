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

    }

    async init(requestType) {

        async function doWork (cb, name) {

            // cb = cb.bind(this)

            try {
                await cb.bind(this)();
                console.log(requestType + " success for " + this.dimension + " record with id " + this._id)
                return this.data;
            } catch (err) {
                console.error("Error in this. " + name + " in Client.init instance with id " + this._id);
                console.error(err);
            }

        }

        let boundDoWork = doWork.bind(this);

        if (requestType === "new") return await boundDoWork(this.createDBObj, "createDBObj");
        if (requestType === "edit") return await boundDoWork(this.updateDBObj, "updateDBObj");
        if (requestType === "view") return await boundDoWork(this.getDataFromSheet, "getDataFromSheet");
        if (requestType === "delete") return await boundDoWork(this.deleteDBObj, "deleteDBObj");

            // try {
            //     await this.createDBObj().bind(this);
            //     console.log("Successfully created new " + this.dimension + " record with id " + id)
            //     return this.data;
            // } catch (err) {
            //     console.error("error in this.createDBObj in Client.init instance with id " + this._id);
            //     console.error(err);
            // }

        // } else if (requestType === "edit") { // runs in the case that this is an existing client to update

            // try {
            //     await this.updateDBObj().bind(this);
            //     console.log("Successfully updated " + this.dimension + " record with id " + this._id);
            //     return this.data;
            // } catch (err) {
            //     console.error("Error in updateDBObj in Client.init instance with id " + this._id);
            //     console.error(err);
            // }

        // } else if (requestType === "view") { // runs if client details are being requested

        //     try {
        //         await this.getDataFromSheet().bind(this);
        //         console.log("Successfully retrieved " + this.dimension + " record with id " + this._id);
        //         return this.data;
        //     } catch (err) {
        //         console.error("Error in getDataFromSheet in Client.init instance with id " + this._id);
        //         console.error(err);
        //     }

        // } else if (requestType === "delete") { // runs if client details are being requested

        //     try {
        //         await this.deleteDBObj().bind(this);
        //         console.log("Successfully deleted " + this.dimension + " record with id " + this._id);
        //         return this.data;
        //     } catch (err) {
        //         console.error("Error in deleteDBObj in Client.init instance with id " + this._id);
        //         console.error(err);
        //     }

        // }

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