const data = {
    business: "kapiti",
    formData: {
        clientDetails: {
            structure: [{
                    sectionTitle: "Identity and Contact Details",
                    fields: [
                        ["cd_accountType", "cd_accountName"], 
                        ["cd_businessName"], 
                        ["cd_mainContactFirstName", "cd_mainContactLastName"], 
                        ["cd_mainContactLandline", "cd_mainContactMobile"],
                        ["cd_mainContactEmail"]
                    ]
                },
                {
                    sectionTitle: "Address Details",
                    fields: [
                        ["cd_billingAddressStreetNumber", "cd_billingAddressStreetName"], 
                        ["cd_billingAddressSuburb", "cd_billingAddressPostCode"], 
                        ["cd_territory"]
                    ]
                },
                {
                    sectionTitle: "Marketing Details",
                    fields: [
                        ["cd_customerDemographic", "cd_estimatedCustomerIncome"], 
                        ["cd_acquisitionChannel"]
                    ]
                }
            ],
            fields: {
                cd_accountType: {
                    label: "Account Type",
                    fieldName: "accountType",
                    fieldType: "datalist",
                    values: ["Single", "Couple", "Business"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_accountName: {
                    label: "Account Name",
                    fieldName: "accountName",
                    fieldType: "Text",
                    readOnly: 1,
                    isRequired: 1
                },
                cd_mainContactFirstName: {
                    label: "Main Contact First Name",
                    fieldName: "mainContactFirstName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_mainContactLastName: {
                    label: "Main Contact Last Name",
                    fieldName: "mainContactLastName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_mainContactEmail: {
                    label: "Main Contact Email",
                    fieldName: "mainContactEmail",
                    fieldType: "Email",
                    readOnly: 0,
                    isRequired: 0
                },
                cd_mainContactLandline: {
                    label: "Main Contact Landline",
                    fieldName: "mainContactLandline",
                    fieldType: "tel",
                    readOnly: 0,
                    isRequired: 0
                },
                cd_mainContactMobile: {
                    label: "Main Contact Mobile",
                    fieldName: "mainContactMobile",
                    fieldType: "tel",
                    readOnly: 0,
                    isRequired: 0
                },
                cd_businessName: {
                    label: "Business Name",
                    fieldName: "businessName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 0
                },
                cd_billingAddressStreetNumber: {
                    label: "Billing Address Street Number",
                    fieldName: "billingAddressStreetNumber",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_billingAddressStreetName: {
                    label: "Billing Address Street Name",
                    fieldName: "billingAddressStreetName",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_billingAddressPostCode: {
                    label: "Billing Address Post Code",
                    fieldName: "billingAddressPostCode",
                    fieldType: "Text",
                    readOnly: 0,
                    isRequired: 1
                },
                cd_billingAddressSuburb: {
                    label: "Billing Address Suburb",
                    fieldName: "billingAddressSuburb",
                    fieldType: "datalist",
                    values: ["Paraparaumu", "Paraparaumu Beach", "Raumati Beach", "Raumati South", "Otaihanga", "Waikanae", "Waikanae Beach"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_territory: {
                    label: "Territory",
                    fieldName: "territory",
                    fieldType: "datalist",
                    values: ["Raumati", "Waikanae"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_customerDemographic: {
                    label: "Customer Demographic",
                    fieldName: "customerDemographic",
                    fieldType: "datalist",
                    values: ["Old Retiree", "Active Retiree", "Baby Boomer (50-65 ish)", "Professional Couple", "Professional Single", "Young Family", "Property Management Company", "Private Landlord", "Other Business"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_estimatedCustomerIncome: {
                    label: "Estimated Customer Income",
                    fieldName: "estimatedCustomerIncome",
                    fieldType: "datalist",
                    values: ["Pension", "$0-$30k", "$30,001 - $50,000", "$50,001 - $70,000", "$70,001 - $90,000", "$90,001+"],
                    readOnly: 0,
                    isRequired: 1
                },
                cd_acquisitionChannel: {
                    label: "How did they come to us?",
                    fieldName: "acquisitionChannel",
                    fieldType: "datalist",
                    values: ["Referral from Partner Business", "Word of Mouth", "Vehicle Signage", "Print Campaign (HAH Kapiti)", "Print Advertising (HAH Kapiti - BAU)", "Online Referral (HAH National - BAU)", "Facebook Advertising (HAH National - BAU)", "Facebook Advertising (HAH Kapiti - BAU)", "Facebook Campaign (HAH Kapiti)", "Other Marketing Campaign (HAH National)", "Flyer Drop", "Gift Voucher", "Sweet Louise Voucher"],
                    readOnly: 0,
                    isRequired: 1
                },
            }
        }
    }
}

export default data