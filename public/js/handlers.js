import forms from "./forms.js";
import {
	initSpinner,
	endSpinner,
	setCreatedDate,
	getAccountNameValue,
	setJobAddressFields,
	revealStatusMessage,
} from "./library.js";

const handlers = {
	handleAccountNameBlur: function () {
		let accountNameField = $("#jobDetails-accountName");

		accountNameField.blur(function (e) {
			setJobAddressFields(accountNameField.val());
		});
	},

	handleAccountTypeInput: function () {
		$("#clientDetailsForm")
			.find(".account-name")
			.on("input", function (e) {
				if (
					$(this)
						.closest(".form-content")
						.find(".form-type-select")
						.val()
						.toLowerCase() === "new"
				) {
					let value = getAccountNameValue(),
						reg = /\b(\w*undefined\w*)\b/g;
					if (value === undefined || value.search(reg) > -1) value = "";
					$("#clientDetails-accountName").val(value);
				}
			});
	},

	handleInputFocus: function () {
		let inputs = $(".form-control");
		inputs.focus(function () {
			$(this).closest("div").find("label").addClass("active");
		});
		inputs.blur(function () {
			$(this).closest("div").find("label").removeClass("active");
		});
	},

	handleFormSubmit: function () {
		$(".form-submit").click(function (e) {
			e.preventDefault();

			let $form = $(this).closest("form");
			let formType =
				$form[0].dataset.name.charAt(0).toUpperCase() +
				$form[0].dataset.name.slice(1);
			let $statusDiv = $form.closest(".form-content").find(".status-message");

			$(this)
				.closest(".form-content")
				.find(".form-record-select-div input")
				.val("");

			setCreatedDate();

			let validation;

			if (formType === "Client") validation = forms.validateClientForm();
			if (formType === "Job") validation = forms.validateJobForm();

			// check default validity. If fails, report validity
			if ($form[0].checkValidity()) {
				// check custom validation. if successful, submit and append client details to array. If unsuccessful, report in error message
				if (validation === true) {
					forms.submitFormFlow($form, formType);
				} else {
					// else, fail validation and present custom error message
					revealStatusMessage(
						formType.toLowerCase(),
						"danger",
						"Error",
						validation
					);
				}
			} else {
				$form[0].reportValidity();
			}
		});
	},

	handleFormTabClick: function () {
		let formTabArr = $(".tab-card");
		formTabArr.on("click", function () {
			// set clicked tab active and all others inactive
			formTabArr.each(function (i, element) {
				element.classList.remove("active-tab");
			});
			this.classList.add("active-tab");

			// toggle form content
			$(".form-content").addClass("d-none");

			let clickedTabName = $(this).attr("data-tab-id");
			$("#" + clickedTabName).removeClass("d-none");
		});
	},

	handlerFormTypeSelect: function () {
		$(".form-type-select").change(function (e) {
			let formType = this.value;
			let $formBody = $(this).closest(".card").find(".form-body");
			let $form = $formBody.find("form");
			let $recordView = $formBody.find(".form-view-body");
			let $formRecordSelect = $(this)
				.closest(".row")
				.find(".form-record-select-div");
			let $formInputs = $form.find("input, select");
			let dim = $form.attr("data-name");
			toggleRecordSelectVisibility = toggleRecordSelectVisibility.bind(this);

			$formRecordSelect.find("input").val("");
			$.each($formBody.find(".form-control"), function (i, el) {
				$(el).val("");
			});

			if (formType === "New") {
				// toggle record select
				toggleRecordSelectVisibility(false);

				// Ensure form is visible and data view is not
				toggleFormVisibility(true);

				// Clear all other fields, set as non-read-only
				$form[0].reset();
				toggleReadOnly(false);

				// If dim === 'job', clear billingAddress textarea
				if (dim === "job") $("#jobDetails-billingAddress").val("");

				// Remove info popup
				$("#" + dim + "DetailsForm")
					.closest(".form-content")
					.find(".status-message")
					.alert("close");

				// ensure accountType field is required
				if (dim === "client") {
					let $accTypeField = $("#clientDetails-accountType");
					$accTypeField[0].required = true;
					$accTypeField.closest(".col-6").find("label").text("Account Type *");
				}
			} else if (formType === "View") {
				// Ensure record select is visible
				toggleRecordSelectVisibility(true);

				// Ensure form not visible and data view is
				toggleFormVisibility(false);

				// Pop up info alert to populate record select field which disappears upon selection
				revealPopUp();

				// toggle delete button
				toggleDeleteButton(false);
			} else if (formType === "Edit") {
				// Ensure record select is visible
				toggleRecordSelectVisibility(true);

				// Ensure form is visible and data view is not
				toggleFormVisibility(true);

				// Pop up info alert to populate record select field which disappears upon selection
				revealPopUp();

				// Clear all other fields, set as non-read-only
				$form[0].reset();
				toggleReadOnly(false);

				// set accountName as readonly=true
				$('input[name="accountName"]').attr("readonly", true);

				// if dim === 'client' set accountType to non-required
				if (dim === "client") {
					let $accTypeField = $("#clientDetails-accountType");
					$accTypeField[0].required = false;
					$accTypeField.closest(".col-6").find("label").text("Account Type");
				}
			} else if (formType === "Delete") {
				// Ensure record select is visible
				toggleRecordSelectVisibility(true);

				// Ensure form not visible and data view is
				toggleFormVisibility(false);

				// Pop up info alert to populate record select field which disappears upon selection
				revealPopUp();

				// reveal delete button
				toggleDeleteButton(true);
			}

			function toggleRecordSelectVisibility(bool) {
				if (bool) {
					$formRecordSelect.removeClass("d-none");
				} else {
					$formRecordSelect.addClass("d-none");
				}
			}

			function toggleFormVisibility(bool) {
				if (bool) {
					$form.removeClass("d-none");
					$recordView.addClass("d-none");
				} else {
					$form.addClass("d-none");
					$recordView.removeClass("d-none");
				}
			}

			function toggleReadOnly(bool) {
				$formInputs.attr("readonly", bool);
				let readOnlyFieldName =
					dim === "client"
						? "clientDetails-accountName"
						: "jobDetails-billingAddress";
				$form.find("#" + readOnlyFieldName).attr("readonly", true);
			}

			function revealPopUp() {
				revealStatusMessage(
					dim,
					"info",
					false,
					"Select a " + dim + " to " + formType.toLowerCase()
				);
			}

			function toggleDeleteButton(bool) {
				let el = $formBody.find(".delete-btn").closest("fieldset");
				if (bool) {
					el.removeClass("d-none");
					el.addClass("d-flex");
				} else {
					el.addClass("d-none");
					el.removeClass("d-flex");
				}
			}
		});
	},

	handleRecordSelectChange: function () {
		$(".form-record-select-div")
			.find("input")
			.change(function (e) {
				let $contentEl = $(this).closest(".form-content");
				let $defaultBody = $contentEl.find(".default-form-body");
				let $viewBody = $contentEl.find(".form-view-body");
				let dim = $contentEl.find("form").attr("data-name");
				let str = $(this).val();
				let id = document.appData[dim + "Detail"].find(
					(obj) => str === obj.concat
				)[dim + "Id"];
				let formAction = $contentEl.find(".form-type-select").val();

				$contentEl.find(".alert").alert("close");

				initSpinner();

				axios
					.get("/" + document.appData.businessName + "/" + dim + "s/" + id)
					.then((result) => {
						console.log(`handleRecordSelectChange handler axios result`);
						const { data } = result;
						console.log(data);

						let $bodyEl = formAction === "Edit" ? $defaultBody : $viewBody;

						// loop through returned properties and apply as values to relevant cells
						let keys = Object.keys(data);
						keys.forEach((key) => {
							if (
								moment(data[key], "YYYY-MM-DDTHH:mm:ss.SSSSZ", true).isValid()
							) {
								data[key] = moment
									.utc(data[key])
									.tz("Pacific/Auckland")
									.format("D/M/YYYY");
							}
							$bodyEl.find('[name="' + key + '"]').val(data[key]);
							$contentEl.find(".status-message .alert").alert("close");
						});

						// set job address fields from document.appData.jobDetails
						// if (dim === "job")
						//   lib.setJobAddressFields($("#jobDetails-accountName").val());
					})
					.catch((err) => {
						console.error(err);
						revealStatusMessage(
							dim,
							"danger",
							"Error",
							"Failed to retrieve client details from Database. Please refresh page."
						);
					})
					.then(endSpinner);
			});
	},

	handleDeleteBtnClick: function () {
		$(".delete-btn").click(function (e) {
			$("#deleteConfirmModal").modal({
				backdrop: true,
			});
		});
	},

	handleDeleteBtnConfirm: function () {
		$(".delete-confirm-btn").click(function (e) {
			// initiate loading spinner
			initSpinner();
			let $viewBody = $(this).closest(".form-content").find(".form-view-body");
			let formType = $(this)
				.closest(".form-content")
				.find("form")
				.attr("data-name");
			let accountName = $viewBody.find('input[name="accountName"]').val();
			let id = $viewBody.find('input[name="' + formType + 'Id"]').val();

			axios
				.delete(
					"/" + document.appData.businessName + "/" + formType + "s/" + id
				)
				.then((result) => {
					// implement success message and clear fields
					revealStatusMessage(
						formType,
						"success",
						"Success",
						"Deleted " + formType + " record for " + accountName
					);
					$viewBody.find("input").empty();
				})
				.catch((err) => {
					console.error(err);
					revealStatusMessage(
						formType,
						"error",
						"Error",
						"Failed to delete record"
					);
				})
				.then(endSpinner);
		});
	},

	handleAlertHide: function () {
		$(".alert").on("close.bs.alert", function (e) {
			e.preventDefault();

			this.classList.add("d-none");
		});
	},
};

export default handlers;
