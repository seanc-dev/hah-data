const moment = require("moment-timezone");
moment.tz.setDefault("Pacific/Auckland");

const mapping = require("./mapping.js");

module.exports = {
  getSheetsAPIName: function (mapping, fieldName) {
    return mapping.find((val) => {
      return val.fieldName === fieldName;
    }).googleRowsAPIName;
  },

  capitaliseWords: function (str) {
    if (!str) return;
    let wordsArr = str.split(" ");
    for (let i = 0; i < wordsArr.length; i++) {
      let word = wordsArr[i];
      wordsArr[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return wordsArr.join(" ");
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

  getObjectFromKey: (orgShortName, dim, searchKey, searchValue, returnKey) => {
    let foundValue;
    try {
      obj2 = mapping[orgShortName.toLowerCase()][dim].find((obj) => {
        return obj[searchKey]
          ? obj[searchKey].toLowerCase() === searchValue.toLowerCase()
          : obj["fieldName"].toLowerCase() === searchValue.toLowerCase();
      });
      foundValue = obj2[returnKey];
    } catch (err) {
      console.log(
        `error in getObjectFromKey for org: ${orgShortName}, dim: ${dim}, searchKey: ${searchKey}, searchValue: ${searchValue}, returnKey: ${returnKey}`
      );
      throw err;
    }
    return foundValue;
  },

  getMaxDateFromArrayOfObjects: function (arrayOfObjects, fieldName) {
    const dtArr = arrayOfObjects
      .map((val, i) => {
        return val[fieldName];
      })
      .sort((a, b) => {
        return a - b;
      });

    return dtArr[dtArr.length - 1];
  },

  getObjectWithMaxDateFromArray: function (arrayOfObjects, fieldName) {
    if (
      !arrayOfObjects ||
      arrayOfObjects.length === 0 ||
      typeof arrayOfObjects !== "object"
    )
      return console.error("arrayOfObjects paramater is not a valid array");

    if (arrayOfObjects.length === 1) return arrayOfObjects[0];

    let arr = arrayOfObjects.sort((a, b) => {
      return a[fieldName] - b[fieldName];
    });

    return arr[arr.length - 1];
  },

  objValuesStrToNumber: function (obj) {
    for (let key in obj) {
      obj[key] = this.strToNumber(obj[key]);
    }

    return obj;
  },
  prepareDataForDbInsert: (body) => {
    const obj = {};
    const keys = Object.keys(body);
    keys.forEach((key) => {
      let val = body[key];
      // convert and reformat date values from nzt
      if (
        moment(val, "YYYY-MM-DDTHH:mm:ssZ", true).isValid() ||
        moment(val, "D/M/YYYY", true).isValid() ||
        moment(val, "YYYY-MM-DD", true).isValid()
      )
        val = moment(val).tz("UTC").format("YYYY-MM-DDTHH:mm:ssZ");
      // remove empty values from insert string (otherwise timestamptz field rejects nulls)
      // (unless you cast them, but I cbf)
      if (body[key]) obj[key] = val;
    });
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
    return (dateObject = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0]
    ));
  },

  strToDateTime: function (dtStr) {
    let dateParts = dtStr.split("/");
    let timeParts = dateParts[2].split(" ")[1].split(":");
    dateParts[2] = dateParts[2].split(" ")[0];
    // month is 0-based, that's why we need dataParts[1] - 1
    return (dateObject = new Date(
      +dateParts[2],
      dateParts[1] - 1,
      +dateParts[0],
      timeParts[0],
      timeParts[1],
      timeParts[2]
    ));
  },

  strToNumber: function (str) {
    let currencyRegExp =
        /^\$([0-9]+\,?[0-9]+)+(\.[0-9]+)?$|^([0-9]+\,?[0-9]+)+(\.[0-9]+)?$/,
      test = currencyRegExp.test(str);

    if (test) str = str.replace(/\$|\,/g, "");

    // test whether return string is numeric
    if (!isNaN(str)) str = Number(str);

    return str;
  },

  sumArray: function (array) {
    for (let i = 0; i < array.length; i++)
      if (typeof Number(array[i]) !== "number")
        return new Error("Array item at index " + i + " is not a number");

    let sum = array.reduce((acc, val, i) => {
      acc += val;
      return acc;
    }, 0);

    return sum;
  },

  sumKeyInObjectsArray: function (arrayOfObjects, key) {
    for (let i = 0; i < arrayOfObjects.length; i++)
      if (typeof arrayOfObjects[i] !== "object")
        return new Error("Array item at index " + i + " is not an object");

    let sum = arrayOfObjects.reduce((acc, val, i) => {
      acc += Number(val[key]);

      return acc;
    }, 0);

    return sum;
  },
  getStaffNamesFromJobPost: (data) => {
    const keys = Object.keys(data);
    return keys.reduce((arr, field) => {
      let match = field.match(/hoursWorked(.*)/);
      if (match) arr.push(match[1]);
      return arr;
    }, []);
  },
};
