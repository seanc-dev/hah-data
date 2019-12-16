const DataObject = require("./dataobject.js"),
    Client = require("./client.js"),
    staff = require("../staff.js"),
    lib = require("../library.js"),
    ss = require("../spreadsheet.js");


class Job extends DataObject {

    constructor(organisationId, id, formData, requestType) {

        super(organisationId, id, "job", formData);

        this.staffNames = staff[this.organisationId].staffNames;

        // if (requestType === "new") { 

        //     this.createDBObj()
        //         .then(function(result){
        //             console.log("Successfully created new " + this.dimension + " record with id " + id)
        //         }).bind(this)
        //         .catch(function(err){
        //             console.error("Failed to create " + this.dimension + " DB record with id " + id);
        //         }).bind(this)
        //         .then(function(result){
        //             new Client(this.organisationId, this.data.clientId, false, "edit");
        //         }).bind(this)
        //         .catch(console.error);

        // } else if (requestType === "edit") { // runs in the case that this is an existing client to update

        //     this.updateDBObj()
        //         .then(function(result){
        //             console.log("Successfully updated " + this.dimension + " record with id " + id);
        //         }).bind(this)
        //         .catch(console.error);

        // } else if (requestType === "view") { // runs if client details are being requested

        //     this.getDataFromSheet()
        //         .then(function(result){
        //             console.log("Successfully returned " + this.dimension + " record with id " + id);
        //         }).bind(this)
        //         .catch(console.error);

        // } else if (requestType === "delete") { // runs if client details are being requested

        //     this.deleteDBObj()
        //         .then(function(result){
        //             console.log("Successfully deleted " + this.dimension + " record with id " + id);
        //         }).bind(this)
        //         .catch(console.error);

        // }

    }

    async init(requestType) {

        async function doWork(cb, name) {

            try {
                await cb.bind(this)();
                console.log(requestType + " success for " + this.dimension + " record with id " + this._id)
                return this.data;
            } catch (err) {
                console.error("error in this. " + name + " in Client.init instance with id " + this._id);
                console.error(err);
            }

        }

        let boundDoWork = doWork.bind(this);

        if (requestType === "new") return await boundDoWork(this.createDBObj, "createDBObj");
        if (requestType === "edit") return await boundDoWork(this.updateDBObj, "updateDBObj");
        if (requestType === "view") return await boundDoWork(this.getDataFromSheet, "getDataFromSheet");
        if (requestType === "delete") return await boundDoWork(this.deleteDBObj, "deleteDBObj");

    }

    computeColumns() {

        // retrieve staff rate data
        return ss.getRowsArrayDataOnly(this.organisationId, "staff", staff[this.organisationId]["mapping"], 1)
            .then(function (result) {

                let staffRates = lib.getObjectWithMaxDateFromArray(result, "effectivedate");
                delete staffRates["effectivedate"];

                for (let key in staffRates) {

                    let fieldName = staff[this.organisationId].mapping.find((val, i) => {
                        return val.googleRowsAPIName === key;
                    }).fieldName

                    this.data[fieldName] = staffRates[key]

                }

                this.accountNameFriendly();
                this.costStaff();
                this.totalJobCost();
                this.totalHoursWorked();
                this.hourlyRateInvoiced();
                this.grossProfit();
                this.grossProfitPercentage();
                this.staffGrossProfitPercentage();
                this.grossProfitPerHourWorked();

                return result;

            }.bind(this))
            .catch(console.error);

    }

    accountNameFriendly() {

        this.data.accountNameFriendly = this.data.accountName.replace(/"'/g, "");

    }

    costStaff() {

        let sum = 0;

        for (let i = 0; i < this.staffNames.length; i++) {

            sum += (Number(this.data["hoursWorked" + this.staffNames[i]]) * Number(this.data["hourlyRate" + this.staffNames[i]]));

        }

        this.data.costStaff = sum;



    }

    grossProfit() {

        this.data.grossProfit = Number(this.data.amountInvoiced) - Number(this.data.totalJobCost);

    }

    grossProfitPercentage() {

        this.data.grossProfitPercentage = lib.round(Number(this.data.grossProfit) / Number(this.data.amountInvoiced), 8);

    }

    hourlyRateInvoiced() {

        this.data.hourlyRateInvoiced = (Number(this.data.amountInvoiced) - (Number(this.data.totalJobCost) - Number(this.data.costStaff))) / Number(this.data.totalHoursWorked)

    }

    staffGrossProfitPercentage() {

        this.data.staffGrossProfitPercentage = lib.round((Number(this.data.grossProfit) / (Number(this.data.grossProfit) + Number(this.data.costStaff))), 8);

    }

    grossProfitPerHourWorked() {

        // job.grossProfit / job.totalHoursWorked
        this.data.grossProfitPerHourWorked = lib.round(Number(this.data.grossProfit) / Number(this.data.totalHoursWorked), 8);

    }

    totalHoursWorked() {

        let sum = 0;

        for (let i = 0; i < this.staffNames.length; i++) {

            let fieldName = "hoursWorked" + this.staffNames[i];
            sum += Number(this.data[fieldName]);

        }

        this.data.totalHoursWorked = sum;

    }

    totalJobCost() {

        this.data.totalJobCost = Number(this.data.costMaterials) + Number(this.data.costStaff) + Number(this.data.costSubcontractor) + Number(this.data.costOther) + Number(this.data.costTipFees);

    }

}

module.exports = Job;