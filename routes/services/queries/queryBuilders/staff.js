module.exports = {
  getStaffRatesByJobId: (staffNames) => {
    let queryStr = "with ";
    staffNames.forEach((name, idx) => {
      queryStr += `${name} as (select jobid, hourlyrate from (select max(hourlyrateeffectivedateutc), hourlyrate, j.id as jobid from job as j inner join staff_rate_history as srh on j.dateinvoicesentutc > srh.hourlyrateeffectivedateutc inner join staff as s on s.id = srh.staffid where s.staffmembername = '${name}' group by hourlyrate, j.id)  as x)`;
      if (idx < staffNames.length - 1) queryStr += ", ";
    });
    queryStr += "select j.id";
    staffNames.forEach(
      (name) =>
        (queryStr += `, case when ${name}.jobid is not null then ${name}.hourlyrate end as hourlyrate${name}`)
    );
    queryStr += " from (select $1 as id) as j ";
    staffNames.forEach(
      (name) =>
        (queryStr += `left outer join ${name} on  j.id = ${name}.jobid `)
    );
    return queryStr;
  },
};
