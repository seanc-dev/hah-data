CREATE TABLE IF NOT EXISTS organisation (id serial PRIMARY KEY, createdDateTimeUTC timestamp with time zone NOT NULL default CURRENT_TIMESTAMP, tradingName text NOT NULL, legalName text NOT NULL UNIQUE, shortName text NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS staff (id serial PRIMARY KEY, organisationId integer REFERENCES organisation (id) NOT NULL, createdDateTimeUTC timestamp with time zone NOT NULL default CURRENT_TIMESTAMP, staffMemberName text NOT NULL, staffMemberStartDate timestamp with time zone NULL, currentlyEmployed numeric(1,0) NOT NULL);

-- organisation insert
INSERT INTO organisation (tradingname, legalname, shortname) VALUES
('Hire a Hubby Kapiti', 'DNS Developments Ltd.', 'Kapiti'),
('Hire a Hubby Wellington', 'Hubby Wellington Ltd.', 'Wellington');

insert into Staff (id, organisationId, staffMemberName, staffMemberStartDate, currentlyEmployed) values
(1, 1, 'Dave', '2002-10-08T00:00:0.000Z', 1),
(2, 1, 'Westy', '2010-03-15T09:55:35.000Z', 1),
(3, 1, 'Boof', '2010-03-15T09:55:35.000Z', 1),
(4, 1, 'Pete', '2010-03-15T09:55:35.000Z', 1),
(5, 1, 'Chris', '2010-03-15T09:55:35.000Z', 0),
(6, 1, 'Zachary', '2019-09-06T00:00:0.000Z', 1),
(7, 2, 'James', '2018-10-07T00:00:0.000Z', 0),
(8, 2, 'Darryl', '2018-10-07T00:00:0.000Z', 1),
(9, 2, 'Wayne', '2019-05-16T00:00:0.000Z', 0),
(10, 2, 'Warrick', '2019-08-13T00:00:0.000Z', 0),
(11, 2, 'Vasco', '2019-08-13T00:00:0.000Z', 1),
(12, 2, 'Aotasi Iose', '2019-09-02T00:00:0.000Z', 1),
(13, 2, 'Rinor Ameti', '2020-02-27T00:00:0.000Z', 1),
(14, 2, 'Ian McGinty', '2020-06-03T00:00:0.000Z', 1);

update staff 
set staffMemberStartDate = (staffMemberStartDate at time zone 'UTC') at time zone 'NZ';

CREATE TABLE IF NOT EXISTS staff_rate_history (id serial PRIMARY KEY, staffId integer REFERENCES staff (id), createdDateTimeUTC timestamp with time zone NOT NULL default CURRENT_TIMESTAMP, hourlyRateEffectiveDate TIMESTAMP WITH TIME ZONE NOT NULL, hourlyRateExpiryDate TIMESTAMP WITH TIME ZONE NULL, hourlyRate NUMERIC(5,2) NOT NULL);

insert into staff_rate_history (id, staffId, hourlyRateEffectiveDate, hourlyRateExpiryDate, hourlyRate) values
(1, 2, '2010-03-15T00:00:0.000Z', null::timestamp with time zone, 26),
(2, 3, '2010-03-15T00:00:0.000Z', null::timestamp with time zone, 24),
(3, 4, '2010-03-15T00:00:0.000Z', null::timestamp with time zone, 24),
(4, 5, '2010-03-15T00:00:0.000Z', null::timestamp with time zone, 22),
(5, 1, '2010-03-15T00:00:0.000Z', null::timestamp with time zone, 26),
(6, 6, '2019-09-06T00:00:0.000Z', null::timestamp with time zone, 20),
(7, 7, '2018-10-08T00:00:0.000Z', null::timestamp with time zone, 36),
(8, 8, '2018-10-08T00:00:0.000Z', '2019-05-16T00:00:0.000Z', 28),
(9, 8, '2019-05-16T00:00:0.000Z', null::timestamp with time zone, 30),
(10, 9, '2019-05-16T00:00:0.000Z', null::timestamp with time zone, 29),
(11, 10, '2019-08-13T00:00:0.000Z', '2020-02-27T00:00:0.000Z', 29),
(12, 10, '2020-02-27T00:00:0.000Z', null::timestamp with time zone, 30),
(13, 11, '2019-09-02T00:00:0.000Z', null::timestamp with time zone, 29),
(14, 12, '2019-09-02T00:00:0.000Z', null::timestamp with time zone, 28),
(15, 13, '2020-02-27T00:00:0.000Z', null::timestamp with time zone, 28),
(16, 14, '2020-06-03T00:00:0.000Z', null::timestamp with time zone, 28);

update staff_rate_history 
set hourlyRateEffectiveDate = (hourlyRateEffectiveDate at time zone 'UTC') at time zone 'NZ'
    , hourlyRateExpiryDate = (hourlyRateExpiryDate at time zone 'UTC') at time zone 'NZ';