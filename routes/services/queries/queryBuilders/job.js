import queries from "./index.js";

const { getJobById } = queries;

export default {
	getJobById: (staffNames) => {
		return getJobById(staffNames);
	},
};
