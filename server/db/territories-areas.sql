DROP TABLE IF EXISTS territory;
CREATE TABLE IF NOT EXISTS territory (
    id                      serial  PRIMARY KEY,
    territoryname           TEXT    NOT NULL,
    areaid                  INT     NOT NULL,
    ownedbyorganisationid   INT REFERENCES organisation (id)
);

insert into territory values (1, 'Miramar', 2, 2);
insert into territory values (2, 'Kilbirnie', 2, 2);
insert into territory values (3, 'Island Bay', 2, null);
insert into territory values (4, 'Mount Victoria', 2, 2);
insert into territory values (5, 'Te Aro', 2, 2);
insert into territory values (6, 'Oriental Bay', 2, 2);
insert into territory values (7, 'Brooklyn', 2, 2);
insert into territory values (8, 'Karori', 2, 2);
insert into territory values (9, 'Wilton', 2, 2);
insert into territory values (10, 'Ngaio', 1, null);
insert into territory values (11, 'Johnsonville', 1, 2);
insert into territory values (12, 'Newlands', 1, 2);
insert into territory values (13, 'Tawa', 1, 2);
insert into territory values (14, 'Titahi Bay', 1, 2);
insert into territory values (15, 'Whitby', 1, 2);
insert into territory values (16, 'Plimmerton', 1, 2);
insert into territory values (17, 'Wainuiomata', 3, 2);
insert into territory values (18, 'Eastbourne', 3, 2);
insert into territory values (19, 'Petone', 3, null);
insert into territory values (20, 'Lower Hutt', 3, 2);
insert into territory values (21, 'Naenae', 3, 2);
insert into territory values (22, 'Taita', 3, 2);
insert into territory values (23, 'Belmont', 3, 2);
insert into territory values (24, 'Silverstream', 3, null);
insert into territory values (25, 'Upper Hutt', 3, 2);
insert into territory values (26, 'Totara Park', 3, 2);

DROP TABLE IF EXISTS area;

CREATE TABLE IF NOT EXISTS area (
    id          serial  PRIMARY KEY,
    areaname    TEXT    NOT NULL
);

insert into area values (1, 'Northwest Wellington');
insert into area values (2, 'South Wellington');
insert into area values (3, 'Hutt Valley');