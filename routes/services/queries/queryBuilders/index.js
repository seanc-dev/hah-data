module.exports = {
  getJobById: (staffNames, client) => {
    let staffNamesTrim = staffNames.map((name) => name.replace(" ", ""));
    let queryStr = "with ";
    staffNamesTrim.forEach((name, idx) => {
      queryStr += `${name} as (select jobid, hourlyrate from (select max(hourlyrateeffectivedateutc), hourlyrate, j.id as jobid from job as j inner join staff_rate_history as srh on j.dateinvoicesentutc > srh.hourlyrateeffectivedateutc inner join staff as s on s.id = srh.staffid where s.staffmembername = '${staffNames[idx]}' group by hourlyrate, j.id)  as x)`;
      if (idx < staffNamesTrim.length - 1) queryStr += ", ";
    });
    queryStr +=
      " select j.id, j.clientid, c.accountname, j.createddatetimeutc, j.worklocationstreetaddress, j.worklocationsuburb, j.primaryjobtype, j.secondaryjobtype, j.indoorsoutdoors, j.datejobenquiryutc, j.datejobquotedutc, j.dateworkcommencedutc, j.dateinvoicesentutc, j.worksatisfaction, j.amountinvoiced, gp.grossprofit, j.costmaterials, j.costsubcontractor, j.costtipfees, j.costother, round((gp.grossprofit / j.amountinvoiced), 8) as grossprofitpercentage, round((gp.grossprofit / (gp.grossprofit + gp.coststaff)), 8) as staffgrossprofitpercentage, round((gp.grossprofit / gp.totalhoursworked), 4) as grossprofitperhourworked, round((((j.amountinvoiced - (gp.grossprofit - gp.coststaff))) / gp.totalhoursworked), 4) as hourlyrateinvoiced, gp.coststaff, gp.totalhoursworked, gp.totaljobcost";
    staffNamesTrim.forEach(
      (name) => (queryStr += `, hoursworked${name}, hourlyrate${name}`)
    );
    queryStr +=
      " from job as j inner join (select id, accountname from client) as c on j.clientid = c.id inner join (select (j.amountinvoiced - tjc.totaljobcost) as grossprofit, tjc.* from job as j inner join (select staff.*, (case when j.costmaterials is not null then j.costmaterials else 0 end + case when j.costsubcontractor is not null then j.costsubcontractor else 0 end + case when j.costtipfees is not null then j.costtipfees else 0 end + case when j.costother is not null then j.costother else 0 end + case when staff.coststaff is not null then staff.coststaff else 0 end) as totaljobcost from job as j inner join  ( select  j.id as jobid, (";
    staffNamesTrim.forEach((name, idx) => {
      if (idx !== 0) queryStr += " + ";
      queryStr += `case when ${name}.jobid is not null then ${name}.hourlyrate * shp.hoursworked${name} else 0 end`;
    });
    queryStr += ") as coststaff, sumhours.totalhoursworked";
    staffNamesTrim.forEach(
      (name) =>
        (queryStr += `, shp.hoursworked${name}, case when ${name}.jobid is not null then ${name}.hourlyrate end as hourlyrate${name}`)
    );
    queryStr +=
      " from job as j inner join (SELECT * FROM crosstab('SELECT sjh.jobid, s.staffmembername as name, sjh.hoursworked FROM staff_job_hours as sjh inner join (select id, staffmembername from staff) as s on sjh.staffid = s.id ORDER  BY 1', $$VALUES ('" +
      staffNames.join("'), ('") +
      "')$$) AS ct (jobid int, hoursWorked" +
      staffNamesTrim.join(" numeric(6,2), hoursWorked") +
      " numeric(5,2))) as shp on j.id = shp.jobid inner join (select jobid, sum(hoursworked) as totalHoursWorked from staff_job_hours group by  jobid) as sumhours on  j.id = sumhours.jobid ";
    staffNamesTrim.forEach(
      (name) =>
        (queryStr += `left outer join ${name} on  j.id = ${name}.jobid and shp.hoursworked${name} is not null `)
    );
    queryStr += `) as staff on j.id = staff.jobid ) tjc on j.id = tjc.jobid ) gp on j.id = gp.jobid where j.${
      client ? "client" : ""
    }id = $1`;
    return queryStr;
  },
};
