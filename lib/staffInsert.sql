select * from staff where organisationid = 1;

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