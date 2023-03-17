export const appendOptionNode = (parent, value) => {
	let option = document.createElement("option");
	option.setAttribute("value", value);
	return parent.appendChild(option);
};

export const capitaliseWords = (str) => {
	if (!str) return;
	let wordsArr = str.split(" ");
	for (let i = 0; i < wordsArr.length; i++) {
		let word = wordsArr[i];
		wordsArr[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}
	return wordsArr.join(" ");
};

export const initialiseAppData = async () => {
	let resultArr;
	try {
		// console.log(document.appData.businessName);
		resultArr = await Promise.all([
			// this retrieves the data required to construct the forms
			axios.get("/" + document.appData.businessName + "/?data=true"),
			// this retrieves client client data
			axios.get(
				"/" +
					document.appData.businessName +
					"/clients?requestType=detailsArray"
			),
			// this retrieves job data
			axios.get(
				"/" + document.appData.businessName + "/jobs?requestType=detailsArray"
			),
		]);
	} catch (err) {
		console.log("initialiseAppData error");
		console.error(err);
		return err;
	}

	const { formOptions, organisationId } = resultArr[0].data;

	document.appData.formOptions = formOptions;
	document.appData.organisationId = organisationId;
	document.appData.clientDetail = resultArr[1].data;
	document.appData.jobDetail = resultArr[2].data;

	return true;
};

export const getAccountNameValue = () => {
	const accountTypeEl = $("#clientDetails-accountType");
	const mainFirstEl = $("#clientDetails-mainContactFirstName");
	const mainLastEl = $("#clientDetails-mainContactLastName");
	const secondaryFirstEl = $("#clientDetails-secondaryContactFirstName");
	const secondaryLastEl = $("#clientDetails-secondaryContactLastName");
	const businessNameEl = $("#clientDetails-businessName");

	let accountTypeVal = capitaliseWords(accountTypeEl.val()),
		businessNameVal = capitaliseWords(businessNameEl.val()),
		mainFirstVal = capitaliseWords(mainFirstEl.val()),
		mainLastVal = capitaliseWords(mainLastEl.val()),
		secondaryFirstVal = capitaliseWords(secondaryFirstEl.val()),
		secondaryLastVal = capitaliseWords(secondaryLastEl.val());

	if (accountTypeVal === "Business") return businessNameVal;
	if (accountTypeVal === "Individual") return mainLastVal + ", " + mainFirstVal;
	if (accountTypeVal === "Couple") {
		if (mainLastVal === secondaryLastVal)
			return mainLastVal + ", " + mainFirstVal + " & " + secondaryFirstVal;
		let val =
			mainLastVal +
			", " +
			mainFirstVal +
			" & " +
			secondaryLastVal +
			", " +
			secondaryFirstVal;
		console.log("couple type if passed");
		console.log(val);
		return val;
	}
};

export const getClientObj = (accountName) => {
	if (!document.appData.clientDetail)
		return console.error("Cannot retrieve client data, please reload page");

	let clientObj = document.appData.clientDetail.find((obj) => {
		return obj.accountName === accountName;
	});

	if (clientObj === -1) clientObj = "No such account name";

	return clientObj;
};

export const googleDateNumberToGBFormat = (GS_date_num) => {
	let GS_earliest_date = new Date(1899, 11, 30),
		//GS_earliest_date gives negative time since it is before 1/1/1970
		GS_date_in_ms = GS_date_num * 24 * 60 * 60 * 1000;
	return new Intl.DateTimeFormat("en-GB").format(
		new Date(GS_date_in_ms + GS_earliest_date.getTime())
	);
};

export const nzdCurrencyFormat = (num) => {
	let nzdFormat = new Intl.NumberFormat("en-NZ", {
		style: "currency",
		currency: "NZD",
		minimumFractionDigits: 2,
	});

	return nzdFormat.format(num);
};

export const initSpinner = () => {
	const opts = {
		lines: 13, // The number of lines to draw
		length: 38, // The length of each line
		width: 10, // The line thickness
		radius: 45, // The radius of the inner circle
		scale: 0.2, // Scales overall size of the spinner
		corners: 0.9, // Corner roundness (0..1)
		color: "##c60062", // CSS color or array of colors
		fadeColor: "transparent", // CSS color or array of colors
		speed: 1, // Rounds per second
		rotate: 0, // The rotation offset
		animation: "spinner-line-fade-quick", // The CSS animation name for the lines
		direction: 1, // 1: clockwise, -1: counterclockwise
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		className: "spinner", // The CSS class to assign to the spinner
		top: "50%", // Top position relative to parent
		left: "50%", // Left position relative to parent
		shadow: "0 0 1px transparent", // Box-shadow for the lines
		position: "absolute", // Element positioning
	};

	let loadingOverlay = $("#loadingOverlay");
	loadingOverlay.removeClass("d-none");
	loadingOverlay.removeClass("page-loaded");
	loadingOverlay.addClass("submit-loader");
	let target = $("#loadingMessage");
	target.empty();
	let spinner = new Spinner(opts).spin(target[0]);

	loadingOverlay.removeClass("d-none");

	return spinner;
};

export const endSpinner = () => {
	$("#loadingOverlay").addClass("d-none");
};

export const removeClassesByRegexp = ($element, regexp) => {
	return $element.removeClass(function (index, className) {
		return (className.match(regexp) || []).join(" ");
	});
};

export const revealStatusMessage = (
	dimension,
	alertType,
	alertTitle,
	alertText
) => {
	console.log("revealStatusMessage dimension");
	console.log(dimension);

	if (!dimension || !alertType || !alertText)
		return new Error(
			"Error: Function activateStatusMessage requires dimension, alertType, and alertText values"
		);

	let $statusDiv = $("#" + dimension.toLowerCase() + "DetailsForm")
		.closest(".form-content")
		.find(".status-message");
	let message = alertTitle
		? "<strong>" + alertTitle + ":</strong> " + alertText
		: alertText;

	$statusDiv.removeClass("d-none");
	$statusDiv.addClass("alert-dismissable");
	removeClassesByRegexp($statusDiv, /(alert-)\w+/g);
	$statusDiv.addClass("alert-" + alertType.toLowerCase());
	console.log($statusDiv);
	$statusDiv.find("span")[0].innerHTML = message;
	$statusDiv.focus();
};

export const setCreatedDate = () => {
	let now = new Date();
	now = now.toLocaleString("en-GB").replace(/,/g, "");

	$('input[name="createdDateTimeNZT"]').val(now);
};

export const setJobAddressFields = (accountNameVal) => {
	let clientObj = getClientObj(accountNameVal);
	console.log(clientObj);
	let streetAddress = clientObj.billingAddressStreet;
	let suburb = clientObj.billingAddressSuburb;

	if (!streetAddress || streetAddress.length < 1) {
		return $("#jobDetails-billingAddress").html(
			"No address in database." + "\n" + "Please update client record."
		);
	}

	$("#jobDetails-billingAddress").html(streetAddress + "\n" + suburb);
	$("#jobDetails-workLocationStreetAddress").val(streetAddress);
	$("#jobDetails-workLocationSuburb").val(suburb);

	$("#jobDetails-clientId").val(clientObj.clientId);
};
