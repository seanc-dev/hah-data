-- https://docs.google.com/spreadsheets/d/1RMtRirdmUXyKzve1c9OuLa8NwSin2U190iAzYVcloZA/edit?usp=sharing

-- CREATE TABLE staff (id serial PRIMARY KEY, organisationId integer REFERENCES organisation (id) NOT NULL, staffMemberName text NOT NULL, staffMemberStartDate timestamptz NULL);

-- insert into "staff" (id, organisationId, staffMemberName, staffMemberStartDate) values
-- (1, 1, 'Dave', '2002-10-08T00:00:0.000Z'),
-- (2, 1, 'Westy', '2010-03-15T09:55:35.000Z'),
-- (3, 1, 'Boof', '2010-03-15T09:55:35.000Z'),
-- (4, 1, 'Pete', '2010-03-15T09:55:35.000Z'),
-- (5, 1, 'Chris', '2010-03-15T09:55:35.000Z'),
-- (6, 1, 'Zachary', '2019-09-06T00:00:0.000Z'),
-- (7, 2, 'James', '2018-10-07T00:00:0.000Z'),
-- (8, 2, 'Darryl', '2018-10-07T00:00:0.000Z'),
-- (9, 2, 'Wayne', '2019-05-16T00:00:0.000Z'),
-- (10, 2, 'Warrick', '2019-08-13T00:00:0.000Z'),
-- (11, 2, 'Vasco', '2019-08-13T00:00:0.000Z'),
-- (12, 2, 'Aotasi Iose', '2019-09-02T00:00:0.000Z'),
-- (13, 2, 'Rinor Ameti', '2020-02-27T00:00:0.000Z'),
-- (14, 2, 'Ian McGinty', '2020-06-03T00:00:0.000Z');

select * from "staff";