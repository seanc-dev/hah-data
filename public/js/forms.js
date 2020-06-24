import lib from "./library.js";

const forms = {
  constructForm: function (formName) {
    const data = document.appData.formOptions;

    //  find form element
    let formEle = document.getElementById(formName + "Form"),
      structureArr = data[formName].structure,
      fieldData = data[formName].fields;

    formEle.setAttribute("method", "POST");
    formEle.setAttribute(
      "action",
      "/" + document.appData.businessName + "/" + data[formName].restfulName
    );

    //  for each item in the structure array, create fieldset.form-group with legend of the sectionTitle
    for (let i = 0; i < structureArr.length; i++) {
      formEle.appendChild(constructFormSection(structureArr[i]));
    }

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

    function addClasses(ele, classArr) {
      for (let q = 0; q < classArr.length; q++) {
        ele.classList.add(classArr[q]);
      }
      return ele;
    }

    function constructButtonCol(btnText, btnType, btnClassArr) {
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
    }

    function constructFormSection(sectionDetail) {
      let fieldsetEl = document.createElement("fieldset");
      fieldsetEl.classList.add("form-group");

      let legendEl = document.createElement("legend");

      fieldsetEl.appendChild(legendEl);

      let legendText = document.createTextNode(sectionDetail.sectionTitle);
      legendEl.appendChild(legendText);

      for (let j = 0; j < sectionDetail.fields.length; j++) {
        fieldsetEl.appendChild(constructInputRow(sectionDetail.fields[j]));
      }

      function constructInputRow(fieldsArr) {
        // create container element
        let containerEl = document.createElement("div"),
          innerEl;
        containerEl.classList.add("row");

        // loop through array of fields to include in row
        for (let k = 0; k < fieldsArr.length; k++) {
          let fieldDetail = fieldData[fieldsArr[k]];
          let uniqueName = formName + "-" + fieldDetail.fieldName;

          // create column element
          innerEl = document.createElement("div");
          innerEl.classList.add("col-6");

          // create label
          let labelEl = document.createElement("label"),
            labelText = fieldDetail.isRequired
              ? fieldDetail.label + " *"
              : fieldDetail.label,
            labelTextNode = document.createTextNode(labelText);
          labelEl.appendChild(labelTextNode);
          labelEl.setAttribute("for", uniqueName);
          innerEl.appendChild(labelEl);

          // create input and add relevant classes and attributes
          let type =
              fieldDetail.fieldType === "select" ||
              fieldDetail.fieldType === "textarea"
                ? fieldDetail.fieldType
                : "input",
            inputEl = document.createElement(type);
          if (
            fieldDetail.additionalClasses &&
            fieldDetail.additionalClasses.length > 0
          )
            addClasses(inputEl, fieldDetail.additionalClasses);
          inputEl.classList.add("form-control");
          inputEl.setAttribute("id", uniqueName);
          if (!fieldDetail.submitExclude)
            inputEl.setAttribute("name", fieldDetail.fieldName);
          if (fieldDetail.pattern)
            inputEl.setAttribute("pattern", fieldDetail.pattern);
          if (type === "input")
            inputEl.setAttribute("type", fieldDetail.fieldType);
          if (fieldDetail.fieldType === "number")
            inputEl.setAttribute("step", "0.01");
          if (fieldDetail.isRequired) inputEl.required = true;
          if (fieldDetail.readOnly) inputEl.setAttribute("readonly", true);

          if (fieldDetail.fieldType === "datalist")
            inputEl.setAttribute("list", fieldDetail.fieldName + "List");
          if (fieldDetail.fieldType === "select")
            addDatalistOptions(inputEl, fieldDetail.values);

          innerEl.appendChild(inputEl);

          if (fieldDetail.fieldType === "datalist")
            innerEl.appendChild(constructDataList(fieldDetail));
          if (fieldDetail.fieldType === "hidden")
            innerEl.classList.add("d-none");

          containerEl.appendChild(innerEl);
        }

        function constructDataList(fieldDetail) {
          let dl = document.createElement("datalist");

          dl.setAttribute("id", fieldDetail.fieldName + "List");

          return addDatalistOptions(dl, fieldDetail.values);
        }

        function addDatalistOptions(housingEl, values) {
          let option, text;
          for (let l = 0; l < values.length; l++) {
            option = document.createElement("option");
            option.setAttribute("value", values[l]);
            text = document.createTextNode(values[l]);
            option.appendChild(text);
            housingEl.appendChild(option);
          }
          return housingEl;
        }

        return containerEl;
      }

      return fieldsetEl;
    }
  },

  initAutocomplete: function () {
    function initAddy(fields) {
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
    let clientObj = document.appData.clientDetail.find((val) => {
      return val.accountName === accountName;
    });

    return axios.get(
      "/" +
        document.appData.businessName +
        "/clients?requestType=address&clientId=" +
        (Number(clientObj.clientId) + 1)
    );
  },

  setViewKeys: function () {
    doWork("client");
    doWork("job");

    async function doWork(dim) {
      // retrieve keys for dimension's db record
      let result;
      try {
        result = await axios.get(
          "/" + document.appData.businessName + "/" + dim + "s?requestType=keys"
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
      let $viewFieldset = $("#" + dim + "ViewFormBody fieldset");
      let fieldLabels = result.data.fieldLabels;
      let fieldNames = result.data.fieldNames;

      // loop through keys and create element tree, then apply key to first el
      for (let i = 0; i < fieldLabels.length; i++) {
        // create row
        let row = createEl("div", ["row"]);
        $viewFieldset[0].appendChild(row);

        // create column to hold field label
        let col = createEl("div", ["col-3", "form-view-text-sm"]);
        col.appendChild(
          document.createTextNode(lib.capitaliseWords(fieldLabels[i]) + ":")
        );
        row.appendChild(col);

        // create column to hold value
        let col2 = createEl("div", ["col-9", "form-view-text-lg"]);
        row.appendChild(col2);
        let input = createEl("input", ["form-control"]);
        input.setAttribute("type", "text");
        input.setAttribute("name", fieldNames[i]);
        input.setAttribute("readonly", true);
        col2.appendChild(input);
      }

      function createEl(elType, classes) {
        let el = document.createElement(elType);
        for (let i = 0; i < classes.length; i++) {
          el.classList.add(classes[i]);
        }
        return el;
      }
    }
  },

  setClientDetails: function () {
    let clientDetail = document.appData.clientDetail;

    // set values in account name list
    let $accountNameDatalist = $("#accountNameList");
    $accountNameDatalist.empty();

    for (let i = 0; i < clientDetail.length; i++) {
      let optionNode = lib.appendOptionNode(
        $accountNameDatalist[0],
        clientDetail[i].accountName
      );
      optionNode.appendChild(
        document.createTextNode(clientDetail[i].accountName)
      );
    }

    // set options in client select drop-down //
    // find field and empty
    let $clientDetailsDatalist = $("#clientDetailsList");
    $clientDetailsDatalist.empty();

    // create datalist options
    for (let i = 0; i < clientDetail.length; i++) {
      let concat =
        "Account: " +
        clientDetail[i].accountName +
        ", Billing Address: " +
        clientDetail[i].billingAddressStreet +
        ", " +
        clientDetail[i].billingAddressSuburb;

      document.appData.clientDetail[i].concat = concat;

      // create new option node, append to record select datalist, and set data-key as clientId
      lib
        .appendOptionNode($clientDetailsDatalist[0], concat)
        .setAttribute("data-key", clientDetail[i].clientId);
    }
  },

  setJobDetails: function () {
    let jobDetail = document.appData.jobDetail;

    // find field and empty
    let $jobDetailDatalist = $("#jobDetailsList");
    $jobDetailDatalist.empty();

    // create datalist options from
    for (let i = 0; i < jobDetail.length; i++) {
      let formattedDate = moment(jobDetail[i].dateInvoiceSent)
        .tz("Pacific/Auckland")
        .format("D/M/YYYY");
      document.appData.jobDetail[i].dateInvoiceSent = formattedDate;

      let concat =
        "Account: " +
        jobDetail[i].accountName +
        ", Date Invoice Sent: " +
        formattedDate +
        ", Amount Invoiced: " +
        lib.nzdCurrencyFormat(jobDetail[i].amountInvoiced);

      document.appData.jobDetail[i].concat = concat;

      // create new option node, append to record select datalist, and set data-key as jobId
      lib
        .appendOptionNode($jobDetailDatalist[0], concat)
        .setAttribute("data-key", jobDetail[i].jobId);
    }
  },

  submitFormFlow: async function (form, formName, statusDiv) {
    lib.initSpinner();

    const formAction = form
      .closest(".form-content")
      .find(".form-type-select")
      .val()
      .toLowerCase();

    // pull out and transform form data
    const formData = form.serializeArray().reduce(function (obj, val) {
      if (val.name === "dateInvoiceSent") console.log(moment(val.value));
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
        let result = await axios.post(
          "/" +
            document.appData.businessName +
            "/" +
            form[0].dataset.name +
            "s",
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

      function appendNewObj(dim, arr, id) {
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
          lib.appendOptionNode(
            document.getElementById("accountNameList"),
            obj.accountName
          );
      }
    } else if (formAction === "edit") {
      try {
        await axios.put(
          "/" +
            document.appData.businessName +
            "/" +
            form[0].dataset.name +
            "s/" +
            formData[formName.toLowerCase() + "Id"],
          formData
        );
      } catch (err) {
        registerSubmitError(err);
      }

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

      function updateObj(searchKey, updateDim, arr) {
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
      }
    }

    function registerSubmitError(err) {
      let v = formAction === "new" ? "created" : "updated";
      lib.revealStatusMessage(
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
    lib.revealStatusMessage(
      form.attr("data-name"),
      "success",
      "Success",
      message
    );

    // clear form
    form[0].reset();
    if (formName === "Job") form.find("#jobDetails-billingAddress").val("");

    lib.endSpinner();
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

    for (let i = 0; i < document.appData.clientDetail.length; i++) {
      accountNameVals.push(document.appData.clientDetail[i].accountName);
    }
    if (!accountNameVals.includes(accountName))
      return "Please ensure Account Name is a valid option from the drop-down list. It must have already been created using the Client Details form.";

    // check if dates entered
    let $dateFields = $jobDetailsForm.find('input[type="date"]'),
      cd = new Date(),
      tenYearsBack = new Date(
        cd.getFullYear() - 10,
        cd.getMonth(),
        cd.getDate()
      );

    for (let i = 0; i < $dateFields.length; i++) {
      let dateVal = new Date($($dateFields[i]).val());

      if (
        dateVal !== "Invalid Date" &&
        (dateVal > cd || dateVal < tenYearsBack)
      )
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
  },
};

export default forms;
