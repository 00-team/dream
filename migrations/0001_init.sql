
create table if not exists users (
    id integer primary key not null,
    name text,
    phone text not null,
    wallet integer not null default 0,
    in_hold integer not null default 0,
    token text not null,
    photo text,
    admin boolean not null default false,
    banned boolean not null default false
);

create table if not exists transactions (
    id integer primary key not null,
    user integer not null references users(id) on delete cascade,
    kind integer not null default 0, -- in OR out | withdrawl OR deposit
    status integer not null default 0, -- success | failed | in progress
    vendor integer not null default 0,
    timestamp integer not null,
    amount integer not null,
    vendor_order_id text,
    vendor_track_id integer,
    card text,
    hashed_card text,
    date integer,
    bank_track_id integer
);


create table if not exists orders (
    id integer primary key not null,
    user integer not null references users(id) on delete cascade,
    kind text not null,
    price integer not null,
    status integer not null default 0,
    data text not null default "{}",
    timestamp integer not null
);

create table if not exists general (
    available_money integer not null default 0,
    total_money integer not null default 0
);
