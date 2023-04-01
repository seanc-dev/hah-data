// import axios from "axios";
import moment from "./moment";

import {
	FieldType,
	FormFieldClass,
	FormName,
	NewField,
	NewFormDetail,
	NewFormsObject,
	Section,
} from "../lib/form-field-logic/types.js";
import {
	AccountName,
	ClientDetailConcat,
	ClientDetailShort,
	Dimension,
	ExtendedDocument,
	JobDetailShort,
	OrgShortName,
} from "./types/types.js";
import {
	initSpinner,
	endSpinner,
	capitaliseWords,
	nzdCurrencyFormat,
	appendOptionNode,
	revealStatusMessage,
} from "./library.js";
import { isDate } from "util/types";

const eDocument = document as unknown as ExtendedDocument;

const forms = {
	constructForms: (
		orgName: OrgShortName,
		formName: FormName,
		data: NewFormsObject
	) => {
		const constructClientOrJobForm = (
			orgName: OrgShortName,
			formName: Omit<FormName, "staff">,
			data: NewFormDetail
		) => {
			const formEle = document.getElementById(formName + "Form");
			const { restfulName, sections } = data;

			if (!formEle) return;

			// set form attributes
			formEle.setAttribute("method", "POST");
			formEle.setAttribute("action", "/" + orgName + "/" + restfulName);

			// loop through sections and build them
			sections.forEach((section) => {
				formEle.appendChild(constructSection(formName, section));
			});

			// create buttons fieldset
			const buttonsFieldset = document.createElement("fieldset");
			buttonsFieldset.classList.add("border-0");
			buttonsFieldset.classList.add("d-flex");
			const row = document.createElement("div");
			addClasses(row, ["row", "justify-content-end"]);

			// append buttons to fieldset
			// row.appendChild(constructButtonCol('Clear', 'button', ['btn-outline-secondary']));
			row.appendChild(
				constructButtonCol("Submit", "submit", ["btn-secondary", "form-submit"])
			);

			// append row to buttons fieldset
			buttonsFieldset.appendChild(row);

			// append button fieldset to form
			formEle.appendChild(buttonsFieldset);
		};

		const constructSection = (
			formName: Omit<FormName, "staff">,
			{ sectionTitle, rows }: Section
		) => {
			const fieldsetEl = document.createElement("fieldset");
			const legendEl = document.createElement("legend");
			const legendText = document.createTextNode(sectionTitle);

			fieldsetEl.classList.add("form-group");
			fieldsetEl.appendChild(legendEl);
			legendEl.appendChild(legendText);

			for (let j = 0; j < rows.length; j++) {
				fieldsetEl.appendChild(constructRow(formName, rows[j]));
			}

			return fieldsetEl;
		};

		const constructRow = (
			formName: Omit<FormName, "staff">,
			rowFieldData: NewField[]
		) => {
			// create container element
			const containerEl = document.createElement("div");

			containerEl.classList.add("row");

			// loop through array of fields to include in row
			for (let k = 0; k < rowFieldData.length; k++) {
				const {
					name,
					label,
					type: fieldType,
					classes,
					values,
					properties: { isRequired, readOnly, excludeOnSubmit },
				} = rowFieldData[k];
				const uniqueName = formName + "-" + name;

				// create column element
				const innerEl = document.createElement("div");
				innerEl.classList.add("col-6");

				// create label
				const labelEl = document.createElement("label");
				const labelText = isRequired ? label + " *" : label;
				const labelTextNode = document.createTextNode(labelText);
				labelEl.appendChild(labelTextNode);
				labelEl.setAttribute("for", uniqueName);
				innerEl.appendChild(labelEl);

				// create input and add relevant classes and attributes
				const type: FieldType =
						fieldType === "select" || fieldType === "textarea"
							? fieldType
							: "input",
					inputEl = document.createElement(type);
				if (classes && classes.length > 0) addClasses(inputEl, classes);
				inputEl.classList.add("form-control");
				inputEl.setAttribute("id", uniqueName);
				if (!excludeOnSubmit) inputEl.setAttribute("name", name);
				if (type === "input") inputEl.setAttribute("type", fieldType);
				if (fieldType === "number") inputEl.setAttribute("step", "0.01");
				if (isRequired) inputEl.required = true;
				if (readOnly) inputEl.setAttribute("readonly", "true");

				if (fieldType === "datalist")
					inputEl.setAttribute("list", name + "List");
				if (fieldType === "select")
					addDatalistOptions(inputEl as HTMLSelectElement, values);

				innerEl.appendChild(inputEl);

				if (fieldType === "datalist")
					innerEl.appendChild(constructDataList(rowFieldData[k]));
				if (fieldType === "hidden") innerEl.classList.add("d-none");

				containerEl.appendChild(innerEl);
			}

			return containerEl;
		};

		const addClasses = (ele: HTMLElement, classArr: FormFieldClass) => {
			for (let q = 0; q < classArr.length; q++) {
				ele.classList.add(classArr[q]);
			}
			return ele;
		};

		const constructDataList = ({ name, values }: NewField): Node => {
			const dl = document.createElement("datalist");

			dl.setAttribute("id", name + "List");

			return addDatalistOptions(dl, values) as Node;
		};

		const addDatalistOptions = (
			housingEl: HTMLDataListElement | HTMLSelectElement,
			values: (string | number)[] | undefined
		) => {
			if (!values) return;
			for (let l = 0; l < values.length; l++) {
				const option = document.createElement("option");
				option.setAttribute("value", `${values[l]}`);
				const text = document.createTextNode(`${values[l]}`);
				option.appendChild(text);
				housingEl.appendChild(option);
			}
			return housingEl;
		};

		const constructButtonCol = (
			btnText: string,
			btnType: string,
			btnClassArr: string[]
		) => {
			const col = document.createElement("div");
			const btn = document.createElement("button");
			const classArr = ["btn", "d-inline", "btn-block"];

			addClasses(col, ["col-2", "p-0", "pl-3"]);
			btnClassArr.forEach((classItem) => classArr.push(classItem));
			addClasses(btn, classArr);
			btn.setAttribute("type", btnType);
			btn.appendChild(document.createTextNode(btnText));
			col.appendChild(btn);

			return col;
		};

		if (formName === "staff") {
			// constructStaffForm(data["staff"]);
		} else {
			constructClientOrJobForm(orgName, formName, data[formName]);
		}
	},

	initAutocomplete: function () {
		const initAddy = (fields: { [key: string]: string }) => {
			// @ts-ignore
			const addyComplete = new AddyComplete(
				document.getElementById(fields.searchField)
			);

			addyComplete.options.excludePostBox = false;
			addyComplete.fields = {
				address1: document.getElementById(fields.address1),
				suburb: document.getElementById(fields.suburb),
				city: document.getElementById(fields.city),
				postcode: document.getElementById(fields.postcode),
			};
		};

		initAddy({
			searchField: "clientDetails-billingAddressStreet",
			address1: "clientDetails-billingAddressStreet",
			suburb: "clientDetails-billingAddressSuburb",
			city: "clientDetails-billingAddressCity",
			postcode: "clientDetails-billingAddressPostcode",
			latitude: "clientDetails-billingAddressLatitude",
			longitude: "clientDetails-billingAddressLongitude",
		});
		initAddy({
			searchField: "jobDetails-workLocationStreetAddress",
			address1: "jobDetails-workLocationStreetAddress",
			suburb: "jobDetails-workLocationSuburb",
			city: "jobDetails-workLocationCity",
			postcode: "jobDetails-workLocationPostcode",
			latitude: "jobDetails-workLocationLatitude",
			longitude: "jobDetails-workLocationLongitude",
		});
	},

	retrieveClientAddress: function (accountName: AccountName) {
		const clientObj = eDocument.appData.clientDetail?.find((val) => {
			return val.accountName === accountName;
		})!;

		// @ts-ignore
		return axios.get(
			"/" +
				eDocument.appData.businessName +
				"/clients?requestType=address&clientId=" +
				(Number(clientObj.clientId) + 1)
		);
	},

	setViewKeys: function () {
		doWork("client");
		doWork("job");

		async function doWork(dim: Dimension) {
			// retrieve keys for dimension's db record
			let result;
			try {
				// @ts-ignore
				result = await axios.get(
					"/" +
						eDocument.appData.businessName +
						"/" +
						dim +
						"s?requestType=keys"
				);
			} catch (err) {
				console.error(
					"Error in setViewKeys doWork async step for " + dim + " dimension"
				);
				console.error(err);
			}

			console.log(`view fieldset ${dim} axios result`);
			console.log(result);

			// define vars
			const $viewFieldset = $("#" + dim + "ViewFormBody fieldset");
			const fieldLabels = result.data.fieldLabels;
			const fieldNames = result.data.fieldNames;

			// loop through keys and create element tree, then apply key to first el
			for (let i = 0; i < fieldLabels.length; i++) {
				// create row
				const row = createEl("div", ["row"]);
				$viewFieldset[0].appendChild(row);

				// create column to hold field label
				const col = createEl("div", ["col-3", "form-view-text-sm"]);
				col.appendChild(
					document.createTextNode(capitaliseWords(fieldLabels[i]) + ":")
				);
				row.appendChild(col);

				// create column to hold value
				const col2 = createEl("div", ["col-9", "form-view-text-lg"]);
				row.appendChild(col2);
				const input = createEl("input", ["form-control"]);
				input.setAttribute("type", "text");
				input.setAttribute("name", fieldNames[i]);
				input.setAttribute("readonly", "true");
				col2.appendChild(input);
			}

			function createEl(elType: string, classes: string[]) {
				const el = document.createElement(elType);
				for (let i = 0; i < classes.length; i++) {
					el.classList.add(classes[i]);
				}
				return el;
			}
		}
	},

	setClientDetails: function () {
		const clientDetail = eDocument.appData.clientDetail;

		// set values in account name list
		const $accountNameDatalist = $("#accountNameList");
		$accountNameDatalist.empty();

		for (let i = 0; i < clientDetail?.length; i++) {
			const optionNode = appendOptionNode(
				$accountNameDatalist[0],
				`${clientDetail[i].accountName}`
			);
			optionNode.appendChild(
				document.createTextNode(`${clientDetail[i].accountName}`)
			);
		}

		// set options in client select drop-down //
		// find field and empty
		const $clientDetailsDatalist = $("#clientDetailsList");
		$clientDetailsDatalist.empty();

		// create datalist options
		for (let i = 0; i < clientDetail.length; i++) {
			const concat: ClientDetailConcat = `Account: ${clientDetail[i].accountName}, Billing Address: ${clientDetail[i].billingAddressStreet}, clientDetail[i].billingAddressSuburb`;

			eDocument.appData.clientDetail[i].concat = concat;

			// create new option node, append to record select datalist, and set data-key as clientId
			appendOptionNode($clientDetailsDatalist[0], concat).setAttribute(
				"data-key",
				`${clientDetail[i].clientId}`
			);
		}
	},

	setJobDetails: function () {
		const jobDetail = eDocument.appData.jobDetail;

		// find field and empty
		const $jobDetailDatalist = $("#jobDetailsList");
		$jobDetailDatalist.empty();

		// create datalist options from
		for (let i = 0; i < jobDetail.length; i++) {
			const formattedDate = moment(jobDetail[i].dateInvoiceSent)
				.tz("Pacific/Auckland")
				.format("D/M/YYYY");
			eDocument.appData.jobDetail[i].dateInvoiceSent = formattedDate;

			let concat =
				"Account: " +
				jobDetail[i].accountName +
				", Date Invoice Sent: " +
				formattedDate +
				", Amount Invoiced: " +
				nzdCurrencyFormat(Number(jobDetail[i].amountInvoiced));

			eDocument.appData.jobDetail[i].concat = concat;

			// create new option node, append to record select datalist, and set data-key as jobId
			appendOptionNode($jobDetailDatalist[0], concat).setAttribute(
				"data-key",
				`${jobDetail[i].jobId}`
			);
		}
	},

	submitFormFlow: async function (
		form: JQuery<HTMLFormElement>,
		formName: FormName
	) {
		initSpinner();

		const formAction = `${form
			.closest(".form-content")
			.find(".form-type-select")
			.val()}`.toLowerCase();

		// pull out and transform form data
		const formData = form.serializeArray().reduce((obj, val) => {
			if (val.name === "dateInvoiceSent") console.log(moment(val.value));
			if (moment(val.value, "YYYY-MM-DD", true).isValid()) {
				val.value = moment(val.value).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
			}
			obj[val.name] = val.value;
			if (!val.value) obj[val.name] = null;
			return obj;
		}, {} as { [key: string]: string | null });

		let newId;

		if (formAction === "new") {
			try {
				// @ts-ignore
				let result = await axios.post(
					"/" +
						eDocument.appData.businessName +
						"/" +
						form[0].dataset.name +
						"s",
					formData
				);
				newId = result.data.id;
			} catch (err) {
				registerSubmitError(err);
			}
			if (formName === "client")
				appendNewObj(
					"client",
					["accountName", "billingAddressStreet", "billingAddressSuburb"],
					newId
				);
			if (formName === "job")
				appendNewObj(
					"job",
					["clientId", "accountName", "dateInvoiceSent", "amountInvoiced"],
					newId
				);

			function appendNewObj(dim: Dimension, arr: string[], id: number) {
				const obj = {} as ClientDetailShort | JobDetailShort;
				// build object of values (id and arr vals)
				// add dimension id from returned id value
				obj[dim + "Id"] = id;
				// loop through array of field names, update values, add them to object
				for (let i = 0; i < arr.length; i++) {
					let val = form.find("#" + dim + "Details-" + arr[i]).val();
					if (val && isNaN(Number(val))) val = Number(val);
					if (arr[i] === "dateInvoiceSent") {
						val = moment(val).format("D/M/YYYY");
					}
					if (!val) continue;
					obj[arr[i]] = val;
				}
				// push into relevant appData array
				if (dim === "client") eDocument.appData.clientDetail.push(obj);
				if (dim === "job") eDocument.appData.jobDetail.push(obj);

				// if new client created, append new option node to datalist for job details account name field
				if (dim === "client")
					appendOptionNode(
						document.getElementById("accountNameList")!,
						obj.accountName as AccountName
					);
			}
		} else if (formAction === "edit") {
			try {
				// @ts-ignore
				await axios.put(
					"/" +
						eDocument.appData.businessName +
						"/" +
						form[0].dataset.name +
						"s/" +
						formData[formName.toLowerCase() + "Id"],
					formData
				);
			} catch (err) {
				registerSubmitError(err);
			}

			// if (formName === "client") {
			// 	updateObj("clientId", "client", [
			// 		"accountName",
			// 		"billingAddressStreet",
			// 		"billingAddressSuburb",
			// 	]);
			// 	updateObj("clientId", "job", ["accountName"]);
			// }
			// if (formName === "job")
			// 	updateObj("jobId", "job", [
			// 		"accountName",
			// 		"dateInvoiceSent",
			// 		"amountInvoiced",
			// 	]);

			// function updateObj(searchKey: string, updateDim: Dimension, arr) {
			// 	// this function updates the data objects held in arrays in eDocument.appData[* + Details]

			// 	// 1. find objects in relevant appData array with search key
			// 	const dimObj = updateDim === 'client' ? eDocument.appData.clientDetail : updateDim === 'job' ? eDocument.appData.jobDetail : undefined
			// 	let objArr = dimObj?.filter((val) => {
			// 		return val[searchKey] == formData[searchKey];
			// 	});

			// 	if (!objArr) return

			// 	// 2. loop through array of objects
			// 	objArr.forEach((obj) => {
			// 		// a. update values
			// 		arr.reduce((acc, val) => {
			// 			acc[val] = formData[val];
			// 			return acc;
			// 		}, obj);
			// 	});

			// 	return objArr;
			// }
		}

		function registerSubmitError(err: any) {
			let v = formAction === "new" ? "created" : "updated";
			revealStatusMessage(
				formName,
				"danger",
				"Error",
				"Record could not be " + v + ". Please refresh page and try again."
			);
			return console.error(err);
		}

		this.setClientDetails();
		this.setJobDetails();

		// trigger success alert
		let v = formAction === "new" ? "created" : "updated",
			message =
				formData.accountName +
				" " +
				formName.toLowerCase() +
				" record successfully " +
				v +
				".";
		revealStatusMessage(formName, "success", "Success", message);

		// clear form
		form[0].reset();
		if (formName === "job") form.find("#jobDetails-billingAddress").val("");

		endSpinner();
	},

	validateClientForm: function () {
		// check if account name entered matches one from list
		let $clientDetailsForm = $("#clientDetailsForm"),
			optionsNodeList = $("#jobDetailsForm")
				.find("#accountNameList")
				.children(),
			accountName = $clientDetailsForm.find("#clientDetails-accountName").val(),
			accountNameVals = [];

		for (let i = 0; i < optionsNodeList.length; i++) {
			accountNameVals.push($(optionsNodeList[i]).val());
		}

		if (accountNameVals.includes(accountName))
			return (
				"Account " +
				accountName +
				" already exists in database. Please submit jobs under existing client record."
			);

		// if all validation passed, return true
		return true;
	},

	validateJobForm: function () {
		// check if account name entered matches one from list
		let $jobDetailsForm = $("#jobDetailsForm"),
			accountName = $jobDetailsForm.find("#jobDetails-accountName").val(),
			accountNameVals = [];

		for (let i = 0; i < eDocument.appData.clientDetail.length; i++) {
			accountNameVals.push(eDocument.appData.clientDetail[i].accountName);
		}
		if (accountName && !accountNameVals.includes(accountName))
			return "Please ensure Account Name is a valid option from the drop-down list. It must have already been created using the Client Details form.";

		// check if dates entered
		const $dateFields = $jobDetailsForm.find('input[type="date"]'),
			cd = new Date(),
			tenYearsBack = new Date(
				cd.getFullYear() - 10,
				cd.getMonth(),
				cd.getDate()
			);

		for (let i = 0; i < $dateFields.length; i++) {
			const $dateVal = $($dateFields[i]).val();
			if (!$dateVal || Array.isArray($dateVal)) continue;
			const dateObj = new Date($dateVal);

			if (isDate(dateObj) && (dateObj > cd || dateObj < tenYearsBack))
				return "Please ensure all entered dates are in the past within the last 10 years.";
		}

		// check to ensure at least 1 hour of work has been entered
		let sum = 0;
		$jobDetailsForm.find(".staff-hours").each((i, staffField) => {
			const value = $(staffField).val();
			if (value && !Array.isArray(value)) sum += Number(value);
		});

		if (sum == 0)
			return "Please ensure the total of hours entered for this job is greater than zero.";

		// if all validation passed, return true
		return true;
	},
};

export default forms;
