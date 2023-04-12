import { initialiseAppData } from "./library.js";
import handlers from "./handlers.js";
import forms from "./forms.js";

$(function () {
	function init() {
		// remove body d-none once loaded static content (ensures loader is uninterrupted)
		document.querySelector("body").classList.remove("d-none");

		// get orgName name from views
		const orgName = document.getElementById("businessName").innerText;

		console.log(document.appData);

		document.appData = {
			businessName: orgName,
		};

		console.log("public/index.js document.appData.businessName");
		console.log(document.appData.businessName);

		initialiseAppData()
			.then((result) => {
				// build forms
				buildForms();

				// kill loader
				let event = new CustomEvent("appready");
				document.dispatchEvent(event);
				console.log("App ready!");
			})
			.catch((err) => {
				alert("There was an error loading the forms. Please refresh the page.");
				console.error("Error in lib.initialiseAppData in index.init");
				console.error(err);
			});

		function buildForms() {
			const { formOptions } = document.appData;
			// form construction
			forms.constructForm(orgName, "clientDetails", formOptions);
			forms.constructForm(orgName, "jobDetails", formOptions);
			forms.setClientDetails();
			forms.setJobDetails();
			forms.setViewKeys();
			forms.initAutocomplete();

			// event handlers
			handlers.handleFormTabClick();
			handlers.handlerFormTypeSelect();
			handlers.handleRecordSelectChange();
			handlers.handleInputFocus();
			handlers.handleAccountNameBlur();
			handlers.handleFormSubmit();
			handlers.handleDeleteBtnClick();
			handlers.handleDeleteBtnConfirm();
			handlers.handleAccountTypeInput();
			handlers.handleAlertHide();

			let clientData = {
				accountType: "Business",
				accountName: "Test Test Test Ltd.",
				businessName: "Test Test Test Ltd.",
				mainContactFirstName: "Coley",
				mainContactLastName: "Coley",
				mainContactLandline: "",
				mainContactMobile: "+64273493710",
				mainContactEmail: "seanco.dev@gmail.com",
				billingAddressStreet: "11 Island View Terrace",
				billingAddressSuburb: "Cockle Bay",
				billingAddressCity: "Auckland",
				billingAddressPostcode: "2014",
				territory: "Raumati",
				customerDemographic: "Baby Boomer (50-65 ish)",
				estimatedCustomerIncome: "Pension",
				acquisitionChannel: "WOM Client",
			};

			let jobData = {
				accountName: "Davia, Ido",
				workLocationStreetAddress: "56 Kiwi Crescent",
				workLocationSuburb: "Tawa",
				workLocationCity: "",
				workLocationPostcode: "",
				primaryJobType: "Maintenance",
				secondaryJobType: "",
				indoorsOutdoors: "Indoors",
				dateJobEnquiry: "",
				dateJobQuoted: "",
				dateWorkCommenced: "",
				dateInvoiceSent: "2019-12-03",
				amountInvoiced: "2",
				costMaterials: "",
				costSubcontractor: "",
				costTipFees: "",
				costOther: "",
				hoursWorkedDave: "",
				workSatisfaction: "5",
				clientId: "10",
			};

			applyTestData("client", clientData);
			applyTestData("job", jobData);

			function applyTestData(dim, data) {
				for (let key in data) {
					let el = document.getElementById(dim + "Details-" + key);

					el.value = data[key];
				}
			}

			applyTestData();
		}
	}

	init();
});
