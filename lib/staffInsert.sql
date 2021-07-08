DO $$
DECLARE organisationid INTEGER;
DECLARE new_staff_name TEXT;
DECLARE starting_date TIMESTAMP WITH TIME ZONE;
DECLARE starting_rate NUMERIC(5,2);
BEGIN

organisationid:= 1; -- 1 for kapiti, 2 for wellington
new_staff_name := 'Mike Yeaton';
starting_date := '2021-07-02T12:00:00.000Z';
starting_rate := 28.00;

insert  into staff (
    organisationid
    , staffmembername
    , staffmemberstartdateutc
    , currentlyemployed
    )
select  organisationid, -- 1 for kapiti, 2 for wellington
        new_staff_name,
        starting_date,
        1;

select * from staff where staffmembername = new_staff_name;

insert into staff_rate_history (
    staffid
    , hourlyrateeffectivedateutc
    , hourlyrate
)
select  id
        , '2021-07-02T12:00:00.000Z'
        , starting_rate
from staff
where staffmembername = new_staff_name;

select * from staff_rate_history where id = (select id from staff where staffmembername = new_staff_name);

END $$;


select * from organisation