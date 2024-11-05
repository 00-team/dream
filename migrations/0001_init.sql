
create table if not exists users (
    id integer primary key not null,
    name text,
    phone text unique not null,
    wallet integer not null default 0,
    in_hold integer not null default 0,
    token text,
    photo text,
    admin boolean not null default false,
    banned boolean not null default false
);
create unique index idx_user_phone on users(phone);
create index idx_user_token on users(token);

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
    timestamp integer not null,
    admin integer references users(id) on delete set null,
    discount integer references discounts(id) on delete set null
);

create table if not exists discounts (
    id integer primary key not null,
    code text unique not null,
    amount integer not null,
    uses integer not null default 0,
    disabled boolean not null default false,
    kind text,
    plan text,
    max_uses integer,
    expires integer
);
create unique index idx_discount_code on discounts(code);

create table if not exists discount_user (
    id integer primary key not null,
    user integer not null references users(id) on delete cascade,
    discount integer not null references discounts(id) on delete cascade
);
create unique index idx_discount_user on discount_user(user, discount);

create table if not exists general (
    available_money integer not null default 0,
    total_money integer not null default 0
);
