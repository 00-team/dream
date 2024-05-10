alter table transactions add column timestamp integer not null default 0;
alter table orders add column price integer not null default 0;
