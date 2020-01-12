const DataObject = require("./dataobject.js"),
    Client = require("./client.js"),
    staff = require("../staff.js"),
    lib = require("../library.js"),
    ss = require("../spreadsheet.js");

class Job extends DataObject {

    constructor(organisationId, id, formData) {

        super(organisationId, id, "job", formData);

        this.staffNames = staff[this.organisationId].staffNames;

    }

    initClientUpdate(){

        let client = new Client(this.organisationId, this.data.clientId, false);
        return client.init("edit");

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

                // this.accountNameFriendly();
                this.costStaff();
                this.totalJobCost();
                this.totalHoursWorked();
                this.hourlyRateInvoiced();
                this.grossProfit();
                this.grossProfitPercentage();
                this.staffGrossProfitPercentage();
                this.grossProfitPerHourWorked();

                return this;

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