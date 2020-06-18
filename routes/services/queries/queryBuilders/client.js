const { getJobById } = require("./index");

module.exports = {
  getJobsByClientIdQuery: (staffNames) => {
    return getJobById(staffNames, true);
  },
};
