import {
	Field,
	Forms,
	Details,
	NewField,
	StaffName,
	FieldNameKey,
	NewFormDetail,
	NewFormsObject,
} from "./types";

export const getNewFormObject = (
	{ clientDetails, jobDetails }: Forms,
	staffNames: StaffName[]
): NewFormsObject => ({
	client: getFormDetails(clientDetails),
	job: getJobFormDetails(jobDetails, staffNames),
	staff: {},
});

const getFormDetails = (detail: Details): NewFormDetail => {
	const { restfulName, structure, fields: fieldReference } = detail;
	return {
		restfulName,
		sections: structure.map(({ sectionTitle, fields }) => ({
			sectionTitle,
			rows: fields.map((row) =>
				row.map((fieldName) => {
					const field = fieldReference[("cd_" + fieldName) as FieldNameKey];
					return getNewFieldFromField(field);
				})
			),
		})),
	};
};

const getJobFormDetails = (
	details: Details,
	staffNames: StaffName[]
): NewFormDetail => {
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

const getFieldRows = (fields: NewField[]): NewField[][] => {
	const fieldKeys: any[] = Object.keys(fields);
	const fieldsArr = fieldKeys.map((fieldKey) => fields[fieldKey]);
	return fieldsArr.reduce((fieldRows, field, idx) => {
		const index = (idx % 2 ? idx - 1 : idx) / 2;
		fieldRows[index] = fieldRows[index] ? fieldRows[index] : [];
		fieldRows[index].push(field);
		return fieldRows;
	}, [] as NewField[][]);
};

const getNewFieldFromField = (field: Field): NewField => {
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

const getJobFormStaffFields = (names: StaffName[]): NewField[] => {
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
