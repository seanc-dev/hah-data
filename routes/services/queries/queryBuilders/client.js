import indexQueries from "./index.js";

const { getJobById } = indexQueries;

export default {
	getJobsByClientIdQuery: (staffNames) => {
		return getJobById(staffNames, true);
	},
};
