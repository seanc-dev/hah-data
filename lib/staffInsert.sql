
insert  into staff (
    organisationid
    , staffmembername
    , staffmemberstartdateutc
    , currentlyemployed
    )
select  1, -- 1 for kapiti, 2 for wellington
        'Iratoka Nelson',
        '2020-11-06T12:00:00.000Z',
        1

select * from staff_rate_history

insert into staff_rate_history (
    staffid
    , hourlyrateeffectivedateutc
    , hourlyrate
)
select  id
        , '2020-11-06T12:00:00.000Z'
        , 24
from staff
where staffmembername = 'Iratoka Nelson'