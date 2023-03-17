import moment from "moment-timezone";

import mapping from "./mapping.js";

moment.tz.setDefault("Pacific/Auckland");

export const getSheetsAPIName = (mapping, fieldName) => {
	return mapping.find((val) => {
		return val.fieldName === fieldName;
	}).googleRowsAPIName;
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

export const getFieldName = (mapping, googleRowsAPIName) => {
	return mapping.find((val) => {
		return val.googleRowsAPIName === googleRowsAPIName;
	}).fieldName;
};

export const getFieldLabelFromName = (mapping, fieldName) => {
	return mapping.find((val) => {
		return val.fieldName === fieldName;
	}).sheetHeaderName;
};

export const getObjectFromKey = (
	orgShortName,
	dim,
	searchKey,
	searchValue,
	returnKey
) => {
	let foundValue, obj2;
	try {
		obj2 = mapping[orgShortName.toLowerCase()][dim].find((obj) => {
			return obj[searchKey]
				? obj[searchKey].toLowerCase() === searchValue.toLowerCase()
				: obj["fieldName"].toLowerCase() === searchValue.toLowerCase();
		});
		foundValue = obj2[returnKey];
	} catch (err) {
		console.log(
			`error in getObjectFromKey for org: ${orgShortName}, dim: ${dim}, searchKey: ${searchKey}, searchValue: ${searchValue}, returnKey: ${returnKey}`
		);
		throw err;
	}
	return foundValue;
};

export const getMaxDateFromArrayOfObjects = (arrayOfObjects, fieldName) => {
	const dtArr = arrayOfObjects
		.map((val) => {
			return val[fieldName];
		})
		.sort((a, b) => {
			return a - b;
		});

	return dtArr[dtArr.length - 1];
};

export const getObjectWithMaxDateFromArray = (arrayOfObjects, fieldName) => {
	if (
		!arrayOfObjects ||
		arrayOfObjects.length === 0 ||
		typeof arrayOfObjects !== "object"
	)
		return console.error("arrayOfObjects paramater is not a valid array");

	if (arrayOfObjects.length === 1) return arrayOfObjects[0];

	let arr = arrayOfObjects.sort((a, b) => {
		return a[fieldName] - b[fieldName];
	});

	return arr[arr.length - 1];
};

export const objValuesStrToNumber = (obj) => {
	for (let key in obj) {
		obj[key] = strToNumber(obj[key]);
	}

	return obj;
};

export const prepareDataForDbInsert = (body) => {
	const obj = {};
	const keys = Object.keys(body);
	keys.forEach((key) => {
		let val = body[key];
		// convert and reformat date values from nzt
		if (
			moment(val, "YYYY-MM-DDTHH:mm:ssZ", true).isValid() ||
			moment(val, "D/M/YYYY", true).isValid() ||
			moment(val, "YYYY-MM-DD", true).isValid()
		)
			val = moment(val).tz("UTC").format("YYYY-MM-DDTHH:mm:ssZ");
		// remove empty values from insert string (otherwise timestamptz field rejects nulls)
		// (unless you cast them, but I cbf)
		if (body[key]) obj[key] = val;
	});
	return obj;
};

export const round = (number, precision) => {
	const factor = Math.pow(10, precision);
	const tempNumber = number * factor;
	const roundedTempNumber = Math.round(tempNumber);

	return roundedTempNumber / factor;
};

export const strToDate = (dtStr) => {
	let dateParts = dtStr.split("/");
	// month is 0-based, that's why we need dataParts[1] - 1
	return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
};

export const strToDateTime = (dtStr) => {
	let dateParts = dtStr.split("/");
	let timeParts = dateParts[2].split(" ")[1].split(":");
	dateParts[2] = dateParts[2].split(" ")[0];
	// month is 0-based, that's why we need dataParts[1] - 1
	return new Date(
		+dateParts[2],
		dateParts[1] - 1,
		+dateParts[0],
		timeParts[0],
		timeParts[1],
		timeParts[2]
	);
};

export const strToNumber = (str) => {
	let currencyRegExp =
			/^\$([0-9]+,?[0-9]+)+(\.[0-9]+)?$|^([0-9]+,?[0-9]+)+(\.[0-9]+)?$/,
		test = currencyRegExp.test(str);

	if (test) str = str.replace(/\$|,/g, "");

	// test whether return string is numeric
	if (!isNaN(str)) str = Number(str);

	return str;
};

export const sumArray = (array) => {
	for (let i = 0; i < array.length; i++)
		if (typeof Number(array[i]) !== "number")
			return new Error("Array item at index " + i + " is not a number");

	let sum = array.reduce((acc, val) => {
		acc += val;
		return acc;
	}, 0);

	return sum;
};

export const sumKeyInObjectsArray = (arrayOfObjects, key) => {
	for (let i = 0; i < arrayOfObjects.length; i++)
		if (typeof arrayOfObjects[i] !== "object")
			return new Error("Array item at index " + i + " is not an object");

	let sum = arrayOfObjects.reduce((acc, val) => {
		acc += Number(val[key]);

		return acc;
	}, 0);

	return sum;
};

export const getStaffNamesFromJobPost = (data) => {
	const keys = Object.keys(data);
	return keys.reduce((arr, field) => {
		let match = field.match(/hoursWorked(.*)/);
		if (match) arr.push(match[1]);
		return arr;
	}, []);
};

export const getNewFormObject = (
	{ clientDetails: client, jobDetails: job },
	staffNames
) => {
	const clientDetails = getFormDetails(client);
	const jobDetails = getJobFormDetails(job, staffNames);
	const data = {
		clientDetails,
		jobDetails,
		staffDetails: {},
	};
	return data;
};

const getFormDetails = (detail) => {
	const { restfulName, structure, fields: fieldReference } = detail;
	return {
		restfulName,
		sections: structure.map(({ sectionTitle, fields }) => ({
			sectionTitle,
			rows: fields.map((row) =>
				row.map((fieldName) => {
					const field = fieldReference[fieldName];
					return getNewFieldFromField(field);
				})
			),
		})),
	};
};

const getNewFieldFromField = (field) => {
	if (!field) return;
	const {
		label,
		fieldName: name,
		fieldType: type,
		values,
		readOnly,
		isRequired,
		submitExclude: excludeOnSubmit,
		additionalClasses: classes,
	} = field;
	return {
		label,
		name,
		type,
		values,
		properties: {
			readOnly,
			isRequired,
			excludeOnSubmit,
		},
		classes,
	};
};

const getJobFormDetails = (details, staffNames) => {
	const staffFields = getJobFormStaffFields(staffNames);
	const newFormDetails = getFormDetails(details);
	const { restfulName, sections } = newFormDetails;
	const staffFieldsRows = getFieldRows(staffFields);
	return {
		restfulName,
		sections: sections.map(({ sectionTitle, rows }) => {
			if (sectionTitle === "Job Cost Details")
				rows = [...rows, ...staffFieldsRows];
			return {
				sectionTitle,
				rows,
			};
		}),
	};
};

const getFieldRows = (fields) => {
	const fieldKeys = Object.keys(fields);
	const fieldsArr = fieldKeys.map((fieldKey) => fields[fieldKey]);
	return fieldsArr.reduce((fieldRows, field, idx) => {
		const index = (idx % 2 ? idx - 1 : idx) / 2;
		fieldRows[index] = fieldRows[index] ? fieldRows[index] : [];
		fieldRows[index].push(field);
		return fieldRows;
	}, []);
};

const getJobFormStaffFields = (names) => {
	return names.map((name) => {
		return {
			label: `${name} Hours Worked`,
			name: `hoursWorked${name.replace(" ", "")}`,
			type: "number",
			classes: ["staff-hours"],
			validationDetail: "Must have > 0 hours across all staff",
			properties: {},
		};
	});
};
