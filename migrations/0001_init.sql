
create table if not exists users (
    id integer primary key not null,
    name text,
    phone text not null,
    wallet integer not null default 0,
    in_hold integer not null default 0,
    token text not null,
    photo text,
    admin boolean not null default false,
    addr text not null default "{}",
    banned boolean not null default false
);

create table if not exists transactions (
    id integer primary key not null,
    user integer not null references users(id) on delete cascade,
    kind integer not null default 0, -- in OR out | withdrawl OR deposit
    status integer not null default 0, -- success | failed | in progress
    amount integer not null,
    idpay_id text,
    idpay_track_id integer,
    card_no text,
    hashed_card_no text,
    date integer,
    bank_track_id integer
);

create table if not exists products (
    id integer primary key not null,
    title text not null,
    detail text,
    end integer not null,
    start integer not null,
    base_price integer not null default 0,
    photos text not null default "{}",
    buy_now_opens integer,
    buy_now_price integer
);

create table if not exists offers (
    id integer primary key not null,
    product integer not null references products(id) on delete cascade,
    user integer references users(id) on delete set null,
    amount integer not null,
    timestamp integer not null
);

create table if not exists verifications (
    id integer primary key not null,
    action text not null,
    phone text not null,
    code text not null,
    expires integer not null,
    tries integer not null default 0
);

create table if not exists general (
    available_money integer not null default 0,
    total_money integer not null default 0
);
