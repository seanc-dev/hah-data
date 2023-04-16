/* eslint-disable no-undef */
export const validateClientForm = function () {
	// check if account name entered matches one from list
	let $clientDetailsForm = $("#clientDetailsForm"),
		optionsNodeList = $("#jobDetailsForm").find("#accountNameList").children(),
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
};

export const validateJobForm = function () {
	// check if account name entered matches one from list
	let $jobDetailsForm = $("#jobDetailsForm"),
		accountName = $jobDetailsForm.find("#jobDetails-accountName").val(),
		accountNameVals = [];

	for (let i = 0; i < document.appData.clientDetail.length; i++) {
		accountNameVals.push(document.appData.clientDetail[i].accountName);
	}
	if (!accountNameVals.includes(accountName))
		return "Please ensure Account Name is a valid option from the drop-down list. It must have already been created using the Client Details form.";

	// check if dates entered
	let $dateFields = $jobDetailsForm.find('input[type="date"]'),
		cd = new Date(),
		tenYearsBack = new Date(cd.getFullYear() - 10, cd.getMonth(), cd.getDate());

	for (let i = 0; i < $dateFields.length; i++) {
		let dateVal = new Date($($dateFields[i]).val());

		if (dateVal !== "Invalid Date" && (dateVal > cd || dateVal < tenYearsBack))
			return "Please ensure all entered dates are in the past within the last 10 years.";
	}

	// check to ensure at least 1 hour of work has been entered
	let sum = 0;
	$jobDetailsForm
		.find(".staff-hours")
		.each((i, field) => (sum += $(field).val()));

	if (sum == 0)
		return "Please ensure the total of hours entered for this job is greater than zero.";

	// if all validation passed, return true
	return true;
};

export const validateStaffForm = function () {
	const $form = $("#staffDetailsForm");
	const name = $form.find("#staffDetails-staffMemberName").val();
	const startDate = $form.find("#staffDetails-staffMemberStartDateUTC").val();
	const endDate = $form.find("#staffDetails-staffMemberEndDateUTC").val();
	const currentlyEmployed = $form.find("#staffDetails-currentlyEmployed")[0]
		.checked;
	const hourlyRateEffectiveDate = $form
		.find("#staffDetails-hourlyRateEffectiveDateUTC")
		.val();

	// staff member name is unique
	for (let i = 0; i < document.appData.staffDetail.length; i++) {
		if (document.appData.staffDetail[i].staffMemberName === name) {
			return "Staff member name already exists in database. Please enter a unique name.";
		}
	}

	// if start date is in the future, currently employed must be 0
	if (startDate > new Date() && currentlyEmployed === 1) {
		return "Start date cannot be in the future if staff member is currently employed.";
	}

	// if end date is in the future, currently employed must be 1
	if (endDate > new Date() && currentlyEmployed === 0) {
		return "End date cannot be in the future if staff member is not currently employed.";

		// if end date is not empty, currently employed must be 0
	} else if (endDate !== "" && currentlyEmployed === 1) {
		return "End date cannot be entered if staff member is currently employed.";
	}

	// if currently employed = 1 end date must be empty
	if (currentlyEmployed === 1 && endDate !== "") {
		return "End date cannot be entered if staff member is currently employed.";
	}

	// start date must be before end date
	if (endDate && startDate > endDate) {
		return "Start date must be before end date.";
	}

	// hourly rate effective date must be on or after start date and before end date
	if (
		endDate &&
		(hourlyRateEffectiveDate < startDate || hourlyRateEffectiveDate >= endDate)
	) {
		return "Hourly rate effective date must be on or after start date and before end date.";
	}
	return true;
};
