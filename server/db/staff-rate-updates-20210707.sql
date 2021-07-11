update staff
set staffmembername = 'Tyson Hill'
where staffmembername = 'Hubby 5';

update staff_rate_history
set hourlyrate = 35
where staffid = (select id from staff where staffmembername = 'Westy');

update staff_rate_history
set hourlyrate = 24.5
where staffid in (select id from staff where staffmembername in ('Pete','Boof'));

update staff_rate_history
set hourlyrate = 22
where staffid = (select id from staff where staffmembername = 'Zachary');

select s.*, srh.hourlyrate, srh.hourlyrateeffectivedateutc from staff s
inner join staff_rate_history srh
on s.id = srh.staffid