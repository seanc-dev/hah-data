/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
import {
	initSpinner,
	endSpinner,
	capitaliseWords,
	appendOptionNode,
	nzdCurrencyFormat,
	getFormRestfulName,
	revealStatusMessage,
} from "./library.js";

const setEntitySelect = (dim, details, textArr, keyArr) => {
	if (!["client", "job", "staff"].includes(dim))
		console.error("invalid dim in setEntitySelect function: ", dim);
	if (!details)
		console.error("invalid details in setEntitySelect function: ", details);
	if (!Array.isArray(textArr) || !Array.isArray(keyArr))
		console.error(
			"invalid textArr or keyArr in setEntitySelect function: ",
			textArr,
			keyArr
		);
	// set options in client select drop-down //
	// find field and empty
	const $dataList = $(`#${dim}DetailsList`);
	$dataList.empty();

	// create datalist options
	for (let i = 0; i < details.length; i++) {
		// create concat string
		const concat = textArr[0]
			? textArr.reduce((acc, curr, idx) => {
					return (acc +=
						textArr[idx] +
						": " +
						details[i][keyArr[idx]] +
						(idx !== textArr.length - 1 ? ", " : ""));
			  }, "")
			: details[i][keyArr[0]];

		document.appData[`${dim}Detail`][i].concat = concat;

		// create new option node, append to record select datalist, and set data-key as clientId
		appendOptionNode($dataList[0], concat).setAttribute(
			"data-key",
			details[i][`${dim}Id`]
		);
	}
};

const forms = {
	constructForm: (orgName, formName, data) => {
		const constructClientOrJobForm = (orgName, formName, data) => {
			const formEle = document.getElementById(formName + "Form");
			const { restfulName, sections } = data;

			if (!formEle)
				throw Error("no form element available in constructForm function");

			// set form attributes
			formEle.setAttribute("method", "POST");
			formEle.setAttribute("action", "/" + orgName + "/" + restfulName);

			// loop through sections and build them
			sections.forEach((section) => {
				formEle.appendChild(constructSection(formName, section));
			});

			// create buttons fieldset
			let buttonsFieldset = document.createElement("fieldset");
			buttonsFieldset.classList.add("border-0");
			buttonsFieldset.classList.add("d-flex");
			let row = document.createElement("div");
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

		const constructSection = (formName, { sectionTitle, rows }) => {
			const fieldsetEl = document.createElement("fieldset");
			const legendEl = document.createElement("legend");
			let legendText = document.createTextNode(sectionTitle);

			fieldsetEl.classList.add("form-group");
			fieldsetEl.appendChild(legendEl);
			legendEl.appendChild(legendText);

			for (let j = 0; j < rows.length; j++) {
				fieldsetEl.appendChild(constructRow(formName, rows[j]));
			}

			return fieldsetEl;
		};

		const constructRow = (formName, rowFieldData) => {
			// create container element
			const containerEl = document.createElement("div");
			let innerEl;

			containerEl.classList.add("row");

			// loop through array of fields to include in row
			for (let k = 0; k < rowFieldData.length; k++) {
				const {
					name,
					label,
					type: fieldType,
					subType,
					classes,
					values,
					properties: { isRequired, readOnly, excludeOnSubmit },
				} = rowFieldData[k];
				let uniqueName = formName + "-" + name;

				// create column element
				innerEl = document.createElement("div");
				innerEl.classList.add("col-6");

				// create label
				if (label) {
					let labelEl = document.createElement("label"),
						labelText = isRequired ? label + " *" : label,
						labelTextNode = document.createTextNode(labelText);
					labelEl.appendChild(labelTextNode);
					labelEl.setAttribute("for", uniqueName);
					innerEl.appendChild(labelEl);
				}

				// create input and add relevant classes and attributes
				let type =
						fieldType === "select" || fieldType === "textarea"
							? fieldType
							: "input",
					inputEl = document.createElement(type);
				if (classes && classes.length > 0) addClasses(inputEl, classes);
				inputEl.classList.add("form-control");
				inputEl.setAttribute("id", uniqueName);
				if (!excludeOnSubmit) inputEl.setAttribute("name", name);
				if (type === "input")
					inputEl.setAttribute("type", subType ?? fieldType);
				if (fieldType === "number" || subType === "number")
					inputEl.setAttribute("step", "0.01");
				if (isRequired) inputEl.required = true;
				if (readOnly) inputEl.setAttribute("readonly", true);

				if (fieldType === "datalist")
					inputEl.setAttribute("list", name + "List");
				if (fieldType === "select") addDatalistOptions(inputEl, values);

				innerEl.appendChild(inputEl);

				if (fieldType === "datalist") {
					innerEl.appendChild(constructDataList(rowFieldData[k]));
				}
				if (fieldType === "hidden") innerEl.classList.add("d-none");

				containerEl.appendChild(innerEl);
			}

			return containerEl;
		};

		const addClasses = (ele, classArr) => {
			for (let q = 0; q < classArr.length; q++) {
				ele.classList.add(classArr[q]);
			}
			return ele;
		};

		const constructDataList = ({ name, values }) => {
			let dl = document.createElement("datalist");

			dl.setAttribute("id", name + "List");

			return addDatalistOptions(dl, values);
		};

		const addDatalistOptions = (housingEl, values) => {
			if (!values) return;
			let option, text;
			for (let l = 0; l < values.length; l++) {
				option = document.createElement("option");
				option.setAttribute("value", `${values[l]}`);
				text = document.createTextNode(`${values[l]}`);
				option.appendChild(text);
				housingEl.appendChild(option);
			}
			return housingEl;
		};

		const constructButtonCol = (btnText, btnType, btnClassArr) => {
			let col = document.createElement("div"),
				btn = document.createElement("button"),
				classArr = ["btn", "d-inline", "btn-block"];

			addClasses(col, ["col-2", "p-0", "pl-3"]);
			btnClassArr.forEach((classItem) => classArr.push(classItem));
			addClasses(btn, classArr);
			btn.setAttribute("type", btnType);
			btn.appendChild(document.createTextNode(btnText));
			col.appendChild(btn);

			return col;
		};
		constructClientOrJobForm(orgName, formName, data);
	},

	initAutocomplete: function () {
		function initAddy(fields) {
			// eslint-disable-next-line no-undef
			let addyComplete = new AddyComplete(
				document.getElementById(fields.searchField)
			);

			addyComplete.options.excludePostBox = false;
			addyComplete.fields = {
				address1: document.getElementById(fields.address1),
				suburb: document.getElementById(fields.suburb),
				city: document.getElementById(fields.city),
				postcode: document.getElementById(fields.postcode),
			};
		}

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

	retrieveClientAddress: function (accountName) {
		const clientObj = document.appData.clientDetail.find((val) => {
			return val.accountName === accountName;
		});

		// eslint-disable-next-line no-undef
		return axios.get(
			"/" +
				document.appData.businessName +
				"/clients?requestType=address&clientId=" +
				(Number(clientObj.clientId) + 1)
		);
	},

	setViewKeys: function () {
		doWork("clients");
		doWork("jobs");
		doWork("staff");

		async function doWork(dim) {
			// retrieve keys for dimension's db record
			let result;
			try {
				result = await axios.get(
					"/" + document.appData.businessName + "/" + dim + "?requestType=keys"
				);
			} catch (err) {
				console.error(
					"Error in setViewKeys doWork async step for " + dim + " dimension"
				);
				console.error(err);
			}

			// find view fieldset element
			const $viewFieldset = $("#" + dim + "ViewFormBody fieldset");

			// enumerate dim to formOptions key
			const formOptionsKey =
				dim[0] === "c"
					? "clientDetails"
					: dim[0] === "j"
					? "jobDetails"
					: "staffDetails";

			// build array of name and labels for each field from formOptions data
			// filtered by the keys sent from db
			// this ensures that the keys displayed are the same as those in the database
			console.log(dim);
			console.log(result.data.fieldNames);
			const fieldData = result.data.fieldNames.map((name) => ({
				name,
				label: document.appData.formOptions[formOptionsKey].sections
					.find((section) =>
						section.rows.some((row) => row.some((field) => field.name === name))
					)
					?.rows.find((row) => row.some((field) => field.name === name))
					.find((field) => field.name === name).label,
			}));

			// helper function to create elements with correct classes
			const createEl = (elType, classes) => {
				const el = document.createElement(elType);
				for (let i = 0; i < classes.length; i++) {
					el.classList.add(classes[i]);
				}
				return el;
			};

			// loop through keys and create element tree, then apply key to first el
			for (let i = 0; i < fieldData.length; i++) {
				const { name, label } = fieldData[i];

				// if no label, skip
				if (!label) continue;
				// create row
				const row = createEl("div", ["row"]);
				$viewFieldset[0].appendChild(row);

				// create column to hold field label
				const col = createEl("div", ["col-3", "form-view-text-sm"]);
				col.appendChild(document.createTextNode(capitaliseWords(label) + ":"));
				row.appendChild(col);

				// create column to hold value
				const col2 = createEl("div", ["col-9", "form-view-text-lg"]);
				row.appendChild(col2);
				const input = createEl("input", ["form-control"]);
				input.setAttribute("type", "text");
				input.setAttribute("name", name);
				input.setAttribute("readonly", true);
				col2.appendChild(input);
			}
		}
	},

	setClientDetails: function () {
		let clientDetail = document.appData.clientDetail;

		// set values in account name list
		let $accountNameDatalist = $("#accountNameList");
		$accountNameDatalist.empty();

		for (let i = 0; i < clientDetail.length; i++) {
			let optionNode = appendOptionNode(
				$accountNameDatalist[0],
				clientDetail[i].accountName
			);
			optionNode.appendChild(
				document.createTextNode(clientDetail[i].accountName)
			);
		}

		// set values in client select drop-down
		setEntitySelect(
			"client",
			clientDetail,
			["Account", "Billing Address", ""],
			["accountName", "billingAddressStreet", "billingAddressSuburb"]
		);
	},

	setJobDetails: function () {
		setEntitySelect(
			"job",
			document.appData.jobDetail.map((job) => {
				const { accountName, dateInvoiceSent, amountInvoiced } = job;
				return {
					...job,
					accountName,
					dateInvoiceSent: moment(dateInvoiceSent)
						.tz("Pacific/Auckland")
						.format("D/M/YYYY"),
					amountInvoiced: nzdCurrencyFormat(amountInvoiced),
				};
			}),
			["Account", "Date Invoice Sent", "Amount Invoiced"],
			["accountName", "dateInvoiceSent", "amountInvoiced"]
		);
	},

	setStaffDetails: function () {
		setEntitySelect(
			"staff",
			document.appData.staffDetail,
			[],
			["staffMemberName"]
		);
	},

	submitFormFlow: async function (form, formName) {
		initSpinner();

		const formAction = form
			.closest(".form-content")
			.find(".form-type-select")
			.val()
			.toLowerCase();

		// pull out and transform form data
		const formData = form.serializeArray().reduce(function (obj, val) {
			if (moment(val.value, "YYYY-MM-DD", true).isValid()) {
				val.value = moment(val.value).format("YYYY-MM-DDTHH:mm:ss.SSSSZ");
			}
			obj[val.name] = val.value;
			if (!val.value) obj[val.name] = null;
			return obj;
		}, {});

		let newId;

		if (formAction === "new") {
			try {
				const result = await axios.post(
					"/" +
						document.appData.businessName +
						"/" +
						getFormRestfulName(form[0].dataset.name),
					formData
				);
				newId = result.data.id;
			} catch (err) {
				registerSubmitError(err);
			}
			if (formName === "Client")
				appendNewObj(
					"client",
					["accountName", "billingAddressStreet", "billingAddressSuburb"],
					newId
				);
			if (formName === "Job")
				appendNewObj(
					"job",
					["clientId", "accountName", "dateInvoiceSent", "amountInvoiced"],
					newId
				);
			if (formName === "Staff")
				appendNewObj("staff", ["staffMemberName"], newId);

			const appendNewObj = (dim, arr, id) => {
				let obj = {};
				// build object of values (id and arr vals)
				// add dimension id from returned id value
				obj[dim + "Id"] = id;
				// loop through array of field names, update values, add them to object
				for (let i = 0; i < arr.length; i++) {
					let val = form.find("#" + dim + "Details-" + arr[i]).val();
					if (isFinite(val)) val = Number(val);
					if (arr[i] === "dateInvoiceSent") {
						val = moment(val).format("D/M/YYYY");
					}
					obj[arr[i]] = val;
				}
				// push into relevant appData array
				document.appData[dim + "Detail"].push(obj);

				// if new client created, append new option node to datalist for job details account name field
				if (dim === "client")
					appendOptionNode(
						document.getElementById("accountNameList"),
						obj.accountName
					);
			};
		} else if (formAction === "edit") {
			const url =
				"/" +
				document.appData.businessName +
				"/" +
				getFormRestfulName(form[0].dataset.name) +
				"/" +
				formData[
					formName.toLowerCase() === "staff"
						? "id"
						: formName.toLowerCase() + "Id"
				];
			try {
				await axios.put(url, formData);
			} catch (err) {
				registerSubmitError(err);
			}

			const updateObj = (searchKey, updateDim, arr) => {
				// this function updates the data objects held in arrays in document.appData[* + Details]

				// 1. find objects in relevant appData array with search key
				let objArr = document.appData[updateDim + "Detail"].filter((val) => {
					return val[searchKey] == formData[searchKey];
				});

				// 2. loop through array of objects
				objArr.forEach((obj) => {
					// a. update values
					arr.reduce((acc, val) => {
						acc[val] = formData[val];
						return acc;
					}, obj);
				});

				return objArr;
			};

			if (formName === "Client") {
				updateObj("clientId", "client", [
					"accountName",
					"billingAddressStreet",
					"billingAddressSuburb",
				]);
				updateObj("clientId", "job", ["accountName"]);
			}
			if (formName === "Job")
				updateObj("jobId", "job", [
					"accountName",
					"dateInvoiceSent",
					"amountInvoiced",
				]);
		}

		function registerSubmitError(err) {
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
		revealStatusMessage(form.attr("data-name"), "success", "Success", message);

		// clear form
		form[0].reset();
		if (formName === "Job") form.find("#jobDetails-billingAddress").val("");

		endSpinner();
	},
};

export default forms;
