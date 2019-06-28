const config = {
    production: {
        kapiti: {
            targetSpreadsheetId: "1Hw7fmBeJma6R3O8eIN1eqhHqKZ0KVNXMil3hYtWJOTk",
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
        },
        wellington: {
            targetSpreadsheetId: "1X6DEUzbnLTjVb1uUQNi5m_v7UhJ5fueQcCVVDdV1pyQ",
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
        },
        wellington: {
            targetSpreadsheetId: "1Q55WeoBNv2RftSRrJ1325S7QTVItqVyE_bZmsUCjwNc", ///"1Hw7fmBeJma6R3O8eIN1eqhHqKZ0KVNXMil3hYtWJOTk",
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