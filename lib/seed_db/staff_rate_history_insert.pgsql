-- https://docs.google.com/spreadsheets/d/1RMtRirdmUXyKzve1c9OuLa8NwSin2U190iAzYVcloZA/edit?usp=sharing

-- CREATE TABLE staff_rate_history (id serial PRIMARY KEY, staffId integer REFERENCES staff (id), hourlyRateEffectiveDate TIMESTAMPTZ NOT NULL, hourlyRate NUMERIC(5,2) NOT NULL, active numeric(1,0) NULL);

insert into staff_rate_history (id, staffId, hourlyRateEffectiveDate, hourlyRate, active) values
(1, 2, '2010-03-15T00:00:0.000Z', 26, 1),
(2, 3, '2010-03-15T00:00:0.000Z', 24, 1),
(3, 4, '2010-03-15T00:00:0.000Z', 24, 1),
(4, 5, '2010-03-15T00:00:0.000Z', 22, 1),
(5, 1, '2010-03-15T00:00:0.000Z', 26, 1),
(6, 6, '2019-09-06T00:00:0.000Z', 20, 1),
(7, 7, '2018-10-08T00:00:0.000Z', 36, 1),
(8, 8, '2018-10-08T00:00:0.000Z', 28, NULL),
(9, 8, '2019-05-16T00:00:0.000Z', 30, 1),
(10, 9, '2019-05-16T00:00:0.000Z', 29, 1),
(11, 10, '2019-08-13T00:00:0.000Z', 29, NULL),
(12, 10, '2020-02-27T00:00:0.000Z', 30, 1),
(13, 11, '2019-09-02T00:00:0.000Z', 29, 1),
(14, 12, '2019-09-02T00:00:0.000Z', 28, 1),
(15, 13, '2020-02-27T00:00:0.000Z', 28, 1),
(16, 14, '2020-06-03T00:00:0.000Z', 28, 1);