const   GoogleSpreadsheet   = require("google-spreadsheet"),
        dotenv              = require("dotenv"),
        creds               = require("../secret/client_secret.json");

dotenv.config();

const   config              = require("./config.js");
const   mapping             = require("./mapping.js");

const   spreadsheetKey      = config[process.env.ENVIRONMENT]["targetSpreadsheetId"];

// Create a document object using the ID of the spreadsheet - obtained from its URL.
const   doc = new GoogleSpreadsheet(spreadsheetKey);

module.exports = {

    getAddressDetailsArray: function(clientId){

        return new Promise((resolve, reject) => {

            // pull address details for client
            this.getRowsXCellsArray(1, clientId, clientId, [10,11])
            .then(function(result){
                console.log(result.data[0]);
                resolve(result.data[0]);
            })
            .catch(reject);

        });

    },

    getCellsArray: function(workSheetIndex, cellIndexArray){

        return new Promise((resolve, reject) => {
            
            cellIndexArray = cellIndexArray.sort((a, b) => a - b);

            // Authenticate with the Google Spreadsheets API.
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // get all cells in range
                doc.getCells(workSheetIndex, {
                    'min-col': cellIndexArray[0],
                    'max-col': cellIndexArray[cellIndexArray.length-1]
                }, function (err, cells) {

                    if(err) reject(err);

                    let obj = {
                        headers: [],
                        data: []
                    };
                    let filtered = cells.reduce((acc, val, i) => {
                        
                        // if current column is included in parameters, continue
                        if(cellIndexArray.includes(val.col)) {
                            // if this is header row, add data to headers array
                            if(val.row == 1) {
                                if(val.col == cellIndexArray[0]) acc.headers.push([]);
                                acc.headers[acc.headers.length-1].push(val._numericValue || val._value);
                            // else add to data
                            } else {
                                if(val.col == cellIndexArray[0]) acc.data.push([]);
                                acc.data[acc.data.length-1].push(val._numericValue || val._value);
                            }
                        }
                        return acc;
                    }, obj);

                    resolve(filtered);

                });

            });

        });

    },

    getClientDetailsArray: function(){

        return new Promise((resolve, reject) => {
            // get client details and account names
            let objectArray;

            this.getCellsArray(1, [2,3])
                .then(function(result){

                    // reorganise returned data into array of objects with props clientId and accountName
                    objectArray = result.data.map(function(val, i){
                        return {
                            clientId: val[0],
                            accountName: val[1]
                        }
                    });

                    resolve(objectArray);

                })
                .catch(reject);

        });
            
    },

    getColumnValuesArray: function(workSheetIndex, cellIndex){

        return new Promise((resolve, reject) => {

            // Authenticate with the Google Spreadsheets API.
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // get all cells in range
                doc.getCells(workSheetIndex, {
                    'min-col': cellIndex,
                    'max-col': cellIndex
                }, function (err, cells) {

                    if(err) reject(err);

                    let obj = {
                        headers: [],
                        data: []
                    };
                    let filtered = cells.reduce((acc, val, i) => {
                        
                        // if this is header row, add data to headers array
                        if(val.row == 1) {
                            acc.headers.push(val._numericValue || val._value);
                        // else add to data
                        } else {
                            acc.data.push(val._numericValue || val._value);
                        }

                        return acc;

                    }, obj);

                    resolve(filtered);

                });

            });

        });

    },

    getRowsArray: function (workSheetIndex, rowStart, rowCount, query) {
        
        let formName;

        if(workSheetIndex === 1) formName = "clientsForm";
        if(workSheetIndex === 2) formName = "jobsForm";

        return new Promise((resolve, reject) => {

            // Authenticate with the Google Spreadsheets API
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // retrieve rows and call callback with resolve value
                doc.getRows(workSheetIndex, {
                    offset: rowStart,
                    limit: rowCount,
                    query: query,
                    orderby: 2 // in Client sheet this is clientId, in Jobs sheet it is jobId
                }, function(err, rows) {

                    resolve(rows);

                });

            });

        });

    },

    getRowsArrayDataOnly: function (workSheetIndex, rowStart, rowCount, query) {
        
        let formName;

        if(workSheetIndex === 1) formName = "client";
        if(workSheetIndex === 2) formName = "job";

        return new Promise((resolve, reject) => {

            // Authenticate with the Google Spreadsheets API
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // retrieve rows and call callback with resolve value
                doc.getRows(workSheetIndex, {
                    offset: rowStart,
                    limit: rowCount,
                    query: query,
                    orderby: 2 // in Client sheet this is clientId, in Jobs sheet it is jobId
                }, function(err, rows) {

                    if (err) reject(err);

                    let newRowsArr = rows.map((val, i) => {

                        let obj = {}

                        for (let i = 0; i < mapping[formName].length; i++){

                            let key = mapping[formName][i].googleRowsAPIName

                            if (val[key]) obj[key] = val[key];

                        }

                        return obj;

                    })

                    resolve(newRowsArr);

                });

            });

        });

    },

    getRowsXCellsArray: function(workSheetIndex, rowMin, rowMax, cellIndexArray){

        return new Promise((resolve, reject) => {
            
            cellIndexArray = cellIndexArray.sort((a, b) => a - b);

            // Authenticate with the Google Spreadsheets API.
            doc.useServiceAccountAuth(creds, function (err) {

                if(err) reject(err);

                // get all cells in range
                doc.getCells(workSheetIndex, {
                    'min-col': cellIndexArray[0],
                    'max-col': cellIndexArray[cellIndexArray.length-1],
                    'min-row': rowMin,
                    'max-row': rowMax
                }, function (err, cells) {

                    if(err) reject(err);

                    let obj = {
                        headers: [],
                        data: []
                    };
                    let filtered = cells.reduce((acc, val, i) => {
                        
                        // if current column is included in parameters, continue
                        if(cellIndexArray.includes(val.col)) {
                            // if this is header row, add data to headers array
                            if(val.row == 1) {
                                if(val.col == cellIndexArray[0]) acc.headers.push([]);
                                acc.headers[acc.headers.length-1].push(val._numericValue || val._value);
                            // else add to data
                            } else {
                                if(val.col == cellIndexArray[0]) acc.data.push([]);
                                acc.data[acc.data.length-1].push(val._numericValue || val._value);
                            }
                        }
                        return acc;
                    }, obj);

                    resolve(filtered);

                });

            });

        });

    }

}