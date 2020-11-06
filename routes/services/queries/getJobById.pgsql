-- job get query with all computed columns and staff details
-- note this is ONLY for the kapiti business, and ONLY if no never staff members exist than Zachary.

with dave as  (
  select  jobid
          , hourlyrate
  from    (
    select  max(hourlyrateeffectivedateutc)
            , hourlyrate
            , j.id as jobid
    from    job as j
            inner join  staff_rate_history as srh
                on  j.dateinvoicesentutc > srh.hourlyrateeffectivedateutc
            inner join  staff as s
                on  s.id = srh.staffid
    where s.staffmembername = 'Dave'
    group by hourlyrate, j.id
  )  as x
), 
westy as(
  select  jobid
          , hourlyrate
  from    (
    select  max(hourlyrateeffectivedateutc)
            , hourlyrate
            , j.id as jobid
    from    job as j
            inner join  staff_rate_history as srh
                on  j.dateinvoicesentutc > srh.hourlyrateeffectivedateutc
            inner join  staff as s
                on  s.id = srh.staffid
    where s.staffmembername = 'Westy'
    group by hourlyrate, j.id
  )  as x
), 
pete as (
  select  jobid
          , hourlyrate
  from    (
    select  max(hourlyrateeffectivedateutc)
            , hourlyrate
            , j.id as jobid
    from    job as j
            inner join  staff_rate_history as srh
                on  j.dateinvoicesentutc > srh.hourlyrateeffectivedateutc
            inner join  staff as s
                on  s.id = srh.staffid
    where s.staffmembername = 'Pete'
    group by hourlyrate, j.id
  )  as x
), 
boof as (
  select  jobid
          , hourlyrate
  from    (
    select  max(hourlyrateeffectivedateutc)
            , hourlyrate
            , j.id as jobid
    from    job as j
            inner join  staff_rate_history as srh
                on  j.dateinvoicesentutc > srh.hourlyrateeffectivedateutc
            inner join  staff as s
                on  s.id = srh.staffid
    where s.staffmembername = 'Boof'
    group by hourlyrate, j.id
  )  as x
), 
chris as (
  select  jobid
          , hourlyrate
  from    (
    select  max(hourlyrateeffectivedateutc)
            , hourlyrate
            , j.id as jobid
    from    job as j
            inner join  staff_rate_history as srh
                on  j.dateinvoicesentutc > srh.hourlyrateeffectivedateutc
            inner join  staff as s
                on  s.id = srh.staffid
    where s.staffmembername = 'Chris'
    group by hourlyrate, j.id
  )  as x
),
zachary as (
  select  jobid
          , hourlyrate
  from    (
    select  max(hourlyrateeffectivedateutc)
            , hourlyrate
            , j.id as jobid
    from    job as j
            inner join  staff_rate_history as srh
                on  j.dateinvoicesentutc > srh.hourlyrateeffectivedateutc
            inner join  staff as s
                on  s.id = srh.staffid
    where s.staffmembername = 'Zachary'
    group by hourlyrate, j.id
  )  as x
)

select  j.clientid
        , j.createddatetimeutc
        , j.worklocationstreetaddress
        , j.worklocationsuburb
        , j.primaryjobtype
        , j.secondaryjobtype
        , j.indoorsoutdoors
        , j.datejobenquiryutc
        , j.datejobquotedutc
        , j.dateworkcommencedutc
        , j.dateinvoicesentutc
        , j.worksatisfaction
        , j.amountinvoiced
        , j.costmaterials
        , j.costsubcontractor
        , j.costtipfees
        , j.costother
        , round((gp.grossprofit / j.amountinvoiced), 8) as grossprofitpercentage
        , round((gp.grossprofit / (gp.grossprofit + gp.coststaff)), 8) as staffgrossprofitpercentage
        , round((gp.grossprofit / gp.totalhoursworked), 4) as grossprofitperhourworked
        , round((((j.amountinvoiced - (gp.grossprofit - gp.coststaff))) / gp.totalhoursworked), 4) as hourlyrateinvoiced
        , gp.*
from    job as j
        inner join  (
        select  (j.amountinvoiced - tjc.totaljobcost) as grossprofit
                , tjc.*
        from    job as j
                inner join  (
                select  staff.*
                        , (case when j.costmaterials is not null then j.costmaterials else 0 end
                            + case when j.costsubcontractor is not null then j.costsubcontractor else 0 end
                            + case when j.costtipfees is not null then j.costtipfees else 0 end
                            + case when j.costother is not null then j.costother else 0 end
                            + case when staff.coststaff is not null then staff.coststaff else 0 end) as totaljobcost
                from    job as j
                        inner join  (
                        select  j.id as jobid
                                , (
                                        case when dave.jobid is not null then dave.hourlyrate * shp.hoursworkeddave else 0 end
                                    + case when westy.jobid is not null then westy.hourlyrate * shp.hoursworkedwesty else 0 end
                                    + case when pete.jobid is not null then pete.hourlyrate * shp.hoursworkedpete else 0 end
                                    + case when boof.jobid is not null then boof.hourlyrate * shp.hoursworkedboof else 0 end
                                    + case when chris.jobid is not null then chris.hourlyrate * shp.hoursworkedchris else 0 end
                                    + case when zachary.jobid is not null then zachary.hourlyrate * shp.hoursworkedzachary else 0 end
                                    ) as coststaff
                                , sumhours.totalhoursworked
                                , shp.hoursworkeddave
                                , case when dave.jobid is not null then dave.hourlyrate end as hourlyratedave
                                , shp.hoursworkedwesty
                                , case when westy.jobid is not null then westy.hourlyrate end as hourlyratewesty
                                , shp.hoursworkedpete
                                , case when pete.jobid is not null then pete.hourlyrate end as hourlyratepete
                                , shp.hoursworkedboof
                                , case when boof.jobid is not null then boof.hourlyrate end as hourlyrateboof
                                , shp.hoursworkedchris
                                , case when chris.jobid is not null then chris.hourlyrate end as hourlyratechris
                                , shp.hoursworkedzachary
                                , case when zachary.jobid is not null then zachary.hourlyrate end as hourlyratezachary
                        from    job as j
                                inner join  (
                                  SELECT *
                                  FROM   crosstab(
                                    'SELECT sjh.jobid, s.staffmembername as name, sjh.hoursworked
                                      FROM   staff_job_hours as sjh
                                              inner join (
                                                          select s.id, s.staffmembername
                                                          from    staff as s
                                                                  inner join  organisation as o
                                                                      on  s.organisationid = o.id
                                                          where   o.shortname = ''kapiti''
                                                          ) as s
                                                  on sjh.staffid = s.id
                                      ORDER  BY 1'

                                    , $$VALUES ('Dave'), ('Westy'), ('Pete'), ('Boof'), ('Chris'), ('Zachary')$$
                                      ) AS ct (jobid int, hoursWorkedDave numeric(6,2), hoursWorkedWesty numeric(6,2), hoursWorkedPete numeric(6,2), hoursWorkedBoof numeric(6,2), hoursWorkedChris numeric(6,2), hoursWorkedZachary numeric(6,2)
                                    )
                                ) as shp
                                    on  j.id = shp.jobid
                                inner join  (
                                  select  jobid
                                          , sum(hoursworked) as totalHoursWorked
                                  from    staff_job_hours
                                  group by  jobid
                                ) as sumhours
                                    on  j.id = sumhours.jobid
                                left outer join dave
                                    on  j.id = dave.jobid
                                    and shp.hoursworkeddave is not null
                                left outer join westy
                                    on  j.id = westy.jobid
                                    and shp.hoursworkedwesty is not null
                                left outer join pete
                                    on  j.id = pete.jobid
                                    and shp.hoursworkedpete is not null
                                left outer join boof
                                    on  j.id = boof.jobid
                                    and shp.hoursworkedboof is not null
                                left outer join chris
                                    on  j.id = chris.jobid
                                    and shp.hoursworkedchris is not null
                                left outer join zachary
                                    on  j.id = zachary.jobid
                                    and shp.hoursworkedzachary is not null
                    ) as staff
                        on  j.id = staff.jobid
                ) tjc
            on  j.id = tjc.jobid
        ) gp
    on  j.id = gp.jobid
order by j.id;