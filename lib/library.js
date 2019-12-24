const mapping = require("./mapping.js");

module.exports = {

    getSheetsAPIName: function (mapping, fieldName) {

        return mapping.find((val) => {
            return val.fieldName === fieldName;
        }).googleRowsAPIName;

    },

    getFieldName: function (mapping, googleRowsAPIName) {

        return mapping.find((val) => {
            return val.googleRowsAPIName === googleRowsAPIName;
        }).fieldName;

    },

    getFieldLabelFromName: function (mapping, fieldName) {

        return mapping.find((val) => {
            return val.fieldName === fieldName;
        }).sheetHeaderName;

    },

    getMaxDateFromArray: function (array, fieldName) {

        let that = this;
        let dtArr = array.map((val, i) => {

            return val[fieldName];

        }).sort((a, b) => {

            a = that.strToDate(a);
            b = that.strToDate(b);

            return a - b;

        });

        return dtArr[dtArr.length - 1];

    },

    getObjectWithMaxDateFromArray: function (arrayOfObjects, fieldName) {

        if (!arrayOfObjects || arrayOfObjects.length === 0 || typeof arrayOfObjects !== "object") return console.error("arrayOfObjects paramater is not a valid array");

        let that = this;

        if (arrayOfObjects.length === 1) return arrayOfObjects[0];

        let arr = arrayOfObjects.sort((a, b) => {

            a = that.strToDate(a[fieldName]);
            b = that.strToDate(b[fieldName]);

            return a - b;

        })

        return arr[arr.length - 1];

    },

    objValuesStrToNumber: function (obj) {

        for (let key in obj) {

            obj[key] = this.strToNumber(obj[key]);

        }

        return obj;

    },

    round: function (number, precision) {

        const factor = Math.pow(10, precision);
        const tempNumber = number * factor;
        const roundedTempNumber = Math.round(tempNumber);

        return roundedTempNumber / factor;

    },

    strToDate: function (dtStr) {

        let dateParts = dtStr.split("/");
        // month is 0-based, that's why we need dataParts[1] - 1
        return dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

    },

    strToDateTime: function (dtStr) {

        let dateParts = dtStr.split("/");
        let timeParts = dateParts[2].split(" ")[1].split(":");
        dateParts[2] = dateParts[2].split(" ")[0];
        // month is 0-based, that's why we need dataParts[1] - 1
        return dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1], timeParts[2]);

    },

    strToNumber: function (str) {

        let currencyRegExp = /^\$([0-9]+\,?[0-9]+)+(\.[0-9]+)?$|^([0-9]+\,?[0-9]+)+(\.[0-9]+)?$/,
            test = currencyRegExp.test(str);

        if (test) str = str.replace(/\$|\,/g, "");

        // test whether return string is numeric
        if (!isNaN(str)) str = Number(str);

        return str;

    },

    sumArray: function (array) {

        for (let i = 0; i < array.length; i++)
            if (typeof Number(array[i]) !== 'number') return new Error("Array item at index " + i + " is not a number");

        let sum = array.reduce((acc, val, i) => {
            acc += val
            return acc;
        }, 0)

        return sum;

    },

    sumKeyInObjectsArray: function (arrayOfObjects, key) {

        for (let i = 0; i < arrayOfObjects.length; i++)
            if (typeof arrayOfObjects[i] !== 'object') return new Error("Array item at index " + i + " is not an object");

        let sum = arrayOfObjects.reduce((acc, val, i) => {

            acc += Number(val[key]);

            return acc

        }, 0);

        return sum;

    }

}