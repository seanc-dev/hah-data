const { pool } = require("./../../../lib/db_config");

module.exports = {
  getColumnHeaders: async (tableName) => {
    let result;
    try {
      result = await pool.query(
        "select column_name from information_schema.columns where table_name = $1",
        [tableName]
      );
    } catch (err) {
      throw err;
    }
    return result.rows;
  },
};
