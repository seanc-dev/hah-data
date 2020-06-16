const { pool } = require("./../../../lib/db_config");

module.exports = {
  getColumnHeaders: async (tableName, orgShortName) => {
    let columns, staffColumns;

    // get columns of job table
    try {
      columns = await pool.query(
        "select column_name from information_schema.columns where table_name = $1 and column_name != 'organisationid'",
        [tableName]
      );
      columns = columns.rows.map(({ column_name }) => column_name);
    } catch (err) {
      console.error(err);
    }

    if (tableName === "job") {
      // pull through staff member columns for job dim
      try {
        staffColumns = await pool.query(
          "select 'hoursWorked'||replace(staffmembername, ' ', '') as staffHoursColumnName, 'hourlyRate'||replace(staffmembername, ' ', '') as staffRateColumnName from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1 order by s.id",
          [orgShortName]
        );
        staffColumns = staffColumns.rows;
      } catch (err) {
        console.error(err);
      }

      // append staffColumns to columns
      staffColumns.forEach((obj) => {
        columns.push(obj.staffhourscolumnname);
        columns.push(obj.staffratecolumnname);
      });
    }

    return columns;
  },
  getStaffNames: async (orgShortName) => {
    let result;
    try {
      result = await pool.query(
        "select distinct staffmembername from staff as s inner join organisation as o on s.organisationid = o.id where o.shortname = $1",
        [orgShortName]
      );
    } catch (err) {
      console.error(err);
      return err;
    }
    return result.rows.map((row) => row.staffmembername);
  },
  getOrgId: async (orgShortName) => {
    let result;
    try {
      result = await pool.query(
        "select id from organisation where shortname = $1",
        [orgShortName]
      );
    } catch (err) {
      console.error(err);
      return err;
    }
    return result.rows[0].id;
  },
};
