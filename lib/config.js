const config = {
    production: {
        kapiti: {
            targetSpreadsheetId: "1MI6j2-Jto4CdJ7kKX4UCh5l1z9BZsLilyP652JEeD80", ///"1Hw7fmBeJma6R3O8eIN1eqhHqKZ0KVNXMil3hYtWJOTk",
            formTargets: {
                job: {
                    sheetName: "Job Details (upon Invoicing)",
                    sheetIndex: 4
                },
                client: {
                    sheetName: "Client Details",
                    sheetIndex: 3
                },
                staff: {
                    sheetName: "Staff Rates",
                    sheetIndex: 6
                }
            }
        }
        // kapiti: {
        //     targetSpreadsheetId: "1cXuQCSlDYLAg6rLDEy0c4Oq5MudJSDCIb6d8n6jOtvs", ///"1Hw7fmBeJma6R3O8eIN1eqhHqKZ0KVNXMil3hYtWJOTk",
        //     formTargets: {
        //         job: {
        //             sheetName: "Job Details (upon Invoicing)",
        //             sheetIndex: 2
        //         },
        //         client: {
        //             sheetName: "Client Details",
        //             sheetIndex: 1
        //         },
        //         staff: {
        //             sheetName: "Staff Rates",
        //             sheetIndex: 3
        //         }
        //     }
        // }
    },
    development: {
        kapiti: {
            targetSpreadsheetId: "1cXuQCSlDYLAg6rLDEy0c4Oq5MudJSDCIb6d8n6jOtvs", ///"1Hw7fmBeJma6R3O8eIN1eqhHqKZ0KVNXMil3hYtWJOTk",
            formTargets: {
                job: {
                    sheetName: "Job Details (upon Invoicing)",
                    sheetIndex: 2
                },
                client: {
                    sheetName: "Client Details",
                    sheetIndex: 1
                },
                staff: {
                    sheetName: "Staff Rates",
                    sheetIndex: 3
                }
            }
        }
    }
}

module.exports = config