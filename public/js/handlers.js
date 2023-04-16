/* eslint-disable no-undef */
import forms from "./forms.js";
import {
	initSpinner,
	endSpinner,
	setCreatedDate,
	getAccountNameValue,
	setJobAddressFields,
	revealStatusMessage,
} from "./library.js";

const getRestfulName = (formType) =>
	`${formType.toLowerCase()}${formType.toLowerCase() === "staff" ? "" : "s"}`;

const handlers = {
	handleAccountNameBlur: function () {
		const accountNameField = $("#jobDetails-accountName");

		accountNameField.on("blur", function () {
			setJobAddressFields(accountNameField.val());
		});
	},

	handleAccountTypeInput: function () {
		$("#clientDetailsForm")
			.find(".account-name")
			.on("input", function () {
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
		const inputs = $(".form-control");
		inputs.on("focus", function () {
			$(this).closest("div").find("label").addClass("active");
		});
		inputs.on("blur", function () {
			$(this).closest("div").find("label").removeClass("active");
		});
	},

	handleFormSubmit: function () {
		$(".form-submit").on("click", function (e) {
			e.preventDefault();

			const $form = $(this).closest("form");
			const formType =
				$form[0].dataset.name.charAt(0).toUpperCase() +
				$form[0].dataset.name.slice(1);
			const $statusDiv = $form.closest(".form-content").find(".status-message");

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
					forms.submitFormFlow($form, formType, $statusDiv);
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
		const formTabArr = $(".tab-card");
		formTabArr.on("click", function () {
			// set clicked tab active and all others inactive
			formTabArr.each(function (i, element) {
				element.classList.remove("active-tab");
			});
			this.classList.add("active-tab");

			// toggle form content
			$(".form-content").addClass("d-none");

			const clickedTabName = $(this).attr("data-tab-id");
			$("#" + clickedTabName).removeClass("d-none");
		});
	},

	handlerFormTypeSelect: function () {
		$(".form-type-select").on("change", function () {
			const formType = this.value;
			const $formBody = $(this).closest(".card").find(".form-body");
			const $form = $formBody.find("form");
			const $recordView = $formBody.find(".form-view-body");
			const $formRecordSelect = $(this)
				.closest(".row")
				.find(".form-record-select-div");
			const $formInputs = $form.find("input, select");
			const dim = $form.attr("data-name");

			let toggleRecordSelectVisibility = function (bool) {
				if (bool) {
					$formRecordSelect.removeClass("d-none");
				} else {
					$formRecordSelect.addClass("d-none");
				}
			};

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
					const $accTypeField = $("#clientDetails-accountType");
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
					const $accTypeField = $("#clientDetails-accountType");
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
				const readOnlyFieldName =
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
				const el = $formBody.find(".delete-btn").closest("fieldset");
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
			.on("change", function () {
				const $contentEl = $(this).closest(".form-content");
				const $defaultBody = $contentEl.find(".default-form-body");
				const $viewBody = $contentEl.find(".form-view-body");
				const dim = $contentEl.find("form").attr("data-name");
				const str = $(this).val();
				const id = document.appData[dim + "Detail"].find(
					(obj) => str === obj.concat
				)[dim + "Id"];
				const formAction = $contentEl.find(".form-type-select").val();

				$contentEl.find(".alert").alert("close");

				initSpinner();

				axios
					.get(
						"/" +
							document.appData.businessName +
							"/" +
							getRestfulName(dim) +
							"/" +
							id
					)
					.then((result) => {
						console.log(`handleRecordSelectChange handler axios result`);
						const { data } = result;
						console.log(data);

						const $bodyEl = formAction === "Edit" ? $defaultBody : $viewBody;

						// loop through returned properties and apply as values to relevant cells
						const keys = Object.keys(data);
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
		$(".delete-btn").on("click", function () {
			$("#deleteConfirmModal").modal({
				backdrop: true,
			});
		});
	},

	handleDeleteBtnConfirm: function () {
		$(".delete-confirm-btn").on("click", function () {
			// initiate loading spinner
			initSpinner();
			const $viewBody = $(this)
				.closest(".form-content")
				.find(".form-view-body");
			const formType = $(this)
				.closest(".form-content")
				.find("form")
				.attr("data-name");
			const accountName = $viewBody.find('input[name="accountName"]').val();
			const id = $viewBody.find('input[name="' + formType + 'Id"]').val();

			axios
				.delete(
					"/" + document.appData.businessName + "/" + formType + "s/" + id
				)
				.then(() => {
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
